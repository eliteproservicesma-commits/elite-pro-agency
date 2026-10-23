import {
  getResendApiKey,
  jsonResponse,
  makeChallenge,
  randomOtp,
  sendResendEmail,
  signValue,
  type EdgeRequest,
  type EdgeResponse,
} from './otp-web';

export const config = { runtime: 'edge' };

type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
type SendWindow = { sentAt: number[] };

const challengeLifetimeMs = 10 * 60 * 1000;
const resendCooldownMs = 60 * 1000;
const hourlyLimit = 3;
const sendWindows = new Map<string, SendWindow>();

export default async function handler(request: EdgeRequest): Promise<EdgeResponse> {
  if (request.method !== 'POST') {
    return jsonResponse(405, { code: 'method_not_allowed', error: 'Use POST.' });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { code: 'invalid_request', error: 'A valid JSON request is required.' });
  }

  const email = body && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    return jsonResponse(400, { code: 'invalid_email', error: 'Enter a valid Gmail address.' });
  }

  const now = Date.now();
  const window = sendWindows.get(email) ?? { sentAt: [] };
  window.sentAt = window.sentAt.filter((sentAt) => now - sentAt < 60 * 60 * 1000);
  if (window.sentAt.length && now - window.sentAt[window.sentAt.length - 1] < resendCooldownMs) {
    return jsonResponse(429, { code: 'resend_wait', error: 'Please wait before requesting another code.' });
  }
  if (window.sentAt.length >= hourlyLimit) {
    return jsonResponse(429, { code: 'rate_limited', error: 'Too many requests. Try again later.' });
  }

  const apiKey = getResendApiKey();
  const code = apiKey ? randomOtp() : '123456';
  const expiresAt = now + challengeLifetimeMs;
  let challengeId: string;

  if (apiKey) {
    try {
      const delivery = await sendResendEmail(apiKey, email, code);
      if (!delivery.ok) {
        return jsonResponse(502, {
          code: 'email_delivery_failed',
          error: 'The verification email could not be sent. Please try again later.',
        });
      }
    } catch {
      return jsonResponse(502, {
        code: 'email_delivery_failed',
        error: 'The verification email could not be sent. Please try again later.',
      });
    }

    const digest = await signValue(code, apiKey);
    const payload: ChallengePayload = { mode: 'email', expiresAt, digest };
    challengeId = await makeChallenge(payload, apiKey);
  } else {
    const payload: ChallengePayload = { mode: 'mock', expiresAt };
    challengeId = await makeChallenge(payload);
  }

  window.sentAt.push(now);
  sendWindows.set(email, window);
  return jsonResponse(200, {
    challengeId,
    expiresInSeconds: Math.floor(challengeLifetimeMs / 1000),
    mode: apiKey ? 'email' : 'mock',
    ...(apiKey ? {} : { mockCode: code }),
  });
}
