import { createTransport } from 'nodemailer';
import { env } from 'node:process';
import { makeChallenge, randomOtp, signValue } from './otp-node';

type ApiRequest = { method?: string; body: unknown };
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
};
type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
type SendWindow = { sentAt: number[] };

const challengeLifetimeMs = 10 * 60 * 1000;
const resendCooldownMs = 60 * 1000;
const hourlyLimit = 3;
const mockCode = '123456';
const sendWindows = new Map<string, SendWindow>();

function response(res: ApiResponse, status: number, body: unknown) {
  return res.status(status).json(body);
}

export default async function handler(request: ApiRequest, res: ApiResponse): Promise<void> {
  if (request.method !== 'POST') {
    response(res, 405, { code: 'method_not_allowed', error: 'Use POST.' });
    return;
  }

  const body = typeof request.body === 'string'
    ? (() => { try { return JSON.parse(request.body) as unknown; } catch { return null; } })()
    : request.body;
  const email = body && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response(res, 400, { code: 'invalid_email', error: 'Enter a valid email address.' });
    return;
  }

  const gmailUser = env.GMAIL_USER?.trim();
  const appPassword = env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  const isProduction = env.NODE_ENV === 'production';
  if ((!gmailUser || !appPassword) && isProduction) {
    response(res, 503, {
      code: 'email_not_configured',
      error: 'Email verification is temporarily unavailable. Please try again later.',
    });
    return;
  }

  const now = Date.now();
  const window = sendWindows.get(email) ?? { sentAt: [] };
  window.sentAt = window.sentAt.filter((sentAt) => now - sentAt < 60 * 60 * 1000);
  if (window.sentAt.length && now - window.sentAt[window.sentAt.length - 1] < resendCooldownMs) {
    response(res, 429, { code: 'resend_wait', error: 'Please wait before requesting another code.' });
    return;
  }
  if (window.sentAt.length >= hourlyLimit) {
    response(res, 429, { code: 'rate_limited', error: 'Too many requests. Try again later.' });
    return;
  }

  const code = gmailUser && appPassword ? randomOtp() : mockCode;
  const expiresAt = now + challengeLifetimeMs;
  let challengeId: string;
  let mode: 'email' | 'mock';

  if (gmailUser && appPassword) {
    try {
      const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: gmailUser, pass: appPassword },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });
      await transporter.sendMail({
        from: { name: 'Elite Pro Services', address: gmailUser },
        to: email,
        subject: 'Your Elite Pro Services verification code',
        text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.6"><h2>Verify your email</h2><p>Your Elite Pro Services verification code is:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
      });
    } catch {
      response(res, 502, {
        code: 'email_delivery_failed',
        error: 'The verification email could not be sent. Please try again later.',
      });
      return;
    }

    const digest = signValue(code, appPassword);
    challengeId = makeChallenge({ mode: 'email', expiresAt, digest } satisfies ChallengePayload, appPassword);
    mode = 'email';
  } else {
    challengeId = makeChallenge({ mode: 'mock', expiresAt } satisfies ChallengePayload);
    mode = 'mock';
  }

  window.sentAt.push(now);
  sendWindows.set(email, window);
  response(res, 200, {
    challengeId,
    expiresInSeconds: Math.floor(challengeLifetimeMs / 1000),
    mode,
    ...(mode === 'mock' ? { mockCode: code } : {}),
  });
}
