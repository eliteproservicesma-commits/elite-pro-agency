import { env } from 'node:process';
import nodemailer from 'nodemailer';
import { isOtpStorageConfigured, issueOtpChallenge } from './otp-storage';
import { randomOtp, signValue } from './otp-node';

type ApiRequest = {
  method?: string;
  body: unknown;
  headers?: Record<string, string | string[] | undefined>;
};
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};
type IssueOtpResult = {
  challengeId?: string;
  expiresInSeconds?: number;
  error?: string;
  retryAfterSeconds?: number;
};
export const config = { runtime: 'nodejs' };

const challengeLifetimeMs = 10 * 60 * 1000;
const challengeIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gmailUser = env.GMAIL_USER?.trim();
const gmailAppPassword = env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
const gmailTransporter = gmailUser && gmailAppPassword
  ? nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailAppPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  })
  : null;

function response(res: ApiResponse, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function getHeader(request: ApiRequest, name: string): string {
  const value = request.headers?.[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

function getClientIp(request: ApiRequest): string {
  const forwardedFor = getHeader(request, 'x-forwarded-for');
  const forwardedIp = forwardedFor.split(',')[0]?.trim();
  return forwardedIp || getHeader(request, 'x-real-ip') || 'unknown-client';
}

function errorMessage(code: string): string {
  if (code === 'resend_wait') return 'Please wait before requesting another code.';
  if (code === 'rate_limited') return 'Too many requests. Try again later.';
  return 'Email verification is temporarily unavailable. Please try again later.';
}

export default async function handler(request: ApiRequest, res: ApiResponse): Promise<void> {
  if (request.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    response(res, 405, { code: 'method_not_allowed', error: 'Use POST.' });
    return;
  }

  const body = typeof request.body === 'string'
    ? (() => { try { return JSON.parse(request.body) as unknown; } catch { return null; } })()
    : request.body;
  const email = body && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  const providedName = body && typeof body === 'object' && 'fullName' in body && typeof body.fullName === 'string'
    ? body.fullName.trim().replace(/\s+/g, ' ')
    : '';
  const fullName = providedName || email.split('@')[0]?.replace(/[._+-]+/g, ' ').trim() || 'Client';

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    response(res, 400, { code: 'invalid_email', error: 'Enter a valid email address.' });
    return;
  }
  if (fullName.length > 80 || /[\u0000-\u001f\u007f]/.test(fullName)) {
    response(res, 400, { code: 'invalid_name', error: 'Enter a valid full name.' });
    return;
  }

  const otpSecret = env.SUPABASE_JWT_SECRET?.trim();
  if (!gmailUser || !gmailAppPassword || !gmailTransporter) {
    response(res, 503, { code: 'email_not_configured', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }
  if (!otpSecret || !isOtpStorageConfigured()) {
    response(res, 503, { code: 'otp_not_configured', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }

  const code = randomOtp();
  const now = Date.now();
  let issued: IssueOtpResult;
  try {
    issued = await issueOtpChallenge({
      email,
      fullName,
      codeDigest: signValue(code, otpSecret),
      ipDigest: signValue(getClientIp(request), otpSecret),
      expiresAt: new Date(now + challengeLifetimeMs).toISOString(),
    });
  } catch {
    response(res, 503, { code: 'otp_storage_unavailable', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }

  if (issued.error) {
    const status = issued.error === 'resend_wait' || issued.error === 'rate_limited' ? 429 : 503;
    if (issued.retryAfterSeconds) res.setHeader('Retry-After', String(issued.retryAfterSeconds));
    response(res, status, { code: issued.error, error: errorMessage(issued.error), retryAfterSeconds: issued.retryAfterSeconds });
    return;
  }

  const challengeId = issued.challengeId;
  if (!challengeId || !challengeIdPattern.test(challengeId)) {
    response(res, 503, { code: 'otp_storage_unavailable', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }

  try {
    const delivery = await gmailTransporter.sendMail({
      from: { name: 'Elite Pro Services', address: gmailUser },
      to: email,
      subject: 'Your Elite Pro Services verification code',
      text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;color:#171717;line-height:1.6"><h2>Verify your email</h2><p>Your Elite Pro Services verification code is:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
    });

    if (!delivery.accepted.length) throw new Error('Gmail did not accept the OTP email.');
  } catch {
    response(res, 502, { code: 'email_delivery_failed', error: 'The verification email could not be sent. Please try again later.' });
    return;
  }

  response(res, 200, {
    challengeId,
    expiresInSeconds: issued.expiresInSeconds ?? Math.floor(challengeLifetimeMs / 1000),
  });
}
