import { env } from 'node:process';
import { makeChallenge, signValue } from './otp-node';
import { verifyOtpChallenge } from './otp-storage';

type ApiRequest = { method?: string; body: unknown };
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};
type VerifyOtpResult = {
  verified?: boolean;
  email?: string;
  fullName?: string;
  error?: string;
};
type SessionPayload = { email: string; fullName: string; expiresAt: number };

export const config = { runtime: 'nodejs' };

const sessionLifetimeSeconds = 60 * 60 * 24 * 30;
const challengeIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function response(res: ApiResponse, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
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
  const challengeId = body && typeof body === 'object' && 'challengeId' in body && typeof body.challengeId === 'string'
    ? body.challengeId
    : '';
  const code = body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
    ? body.code
    : '';

  if (!challengeIdPattern.test(challengeId) || !/^\d{6}$/.test(code)) {
    response(res, 400, { code: 'invalid_code', error: 'Enter the six-digit code.' });
    return;
  }

  const sessionSecret = env.SUPABASE_JWT_SECRET?.trim();
  if (!sessionSecret) {
    response(res, 503, { code: 'otp_not_configured', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }

  let verification: VerifyOtpResult;
  try {
    verification = await verifyOtpChallenge(challengeId, signValue(code, sessionSecret));
  } catch {
    response(res, 503, { code: 'otp_storage_unavailable', error: 'Email verification is temporarily unavailable. Please try again later.' });
    return;
  }

  if (verification.error || !verification.verified || !verification.email || !verification.fullName) {
    const errorCode = verification.error ?? 'invalid_code';
    const status = errorCode === 'attempt_limit' ? 429 : errorCode === 'otp_storage_unavailable' ? 503 : 400;
    const message = errorCode === 'otp_expired'
      ? 'That verification code has expired. Request a new one.'
      : errorCode === 'attempt_limit'
        ? 'Too many incorrect attempts. Request a new code.'
        : errorCode === 'otp_storage_unavailable'
          ? 'Email verification is temporarily unavailable. Please try again later.'
          : 'That code is not valid.';
    response(res, status, { code: errorCode, error: message });
    return;
  }

  const sessionPayload: SessionPayload = {
    email: verification.email,
    fullName: verification.fullName,
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
  };
  const sessionToken = makeChallenge(sessionPayload, sessionSecret);
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `elitepro_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionLifetimeSeconds}${secure}`);
  response(res, 200, {
    verified: true,
    profile: { email: verification.email, fullName: verification.fullName, verified: true },
  });
}
