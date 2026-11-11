import { makeChallenge, readChallengePayload, verifySignature } from './otp-node';
import { env } from 'node:process';

type ApiRequest = { method?: string; body: unknown };
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};
type ChallengePayload = { mode: 'email'; expiresAt: number; digest: string; email: string; fullName: string };

export const config = { runtime: 'nodejs' };

const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

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
  const challengeId = body && typeof body === 'object' && 'challengeId' in body && typeof body.challengeId === 'string'
    ? body.challengeId
    : '';
  const code = body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
    ? body.code
    : '';
  if (!/^\d{6}$/.test(code) || !challengeId || challengeId.length > 2048) {
    response(res, 400, { code: 'invalid_code', error: 'Enter the six-digit code.' });
    return;
  }

  const [encodedPayload, signature, ...extra] = challengeId.split('.');
  if (extra.length > 0 || !encodedPayload) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }

  let challenge: ChallengePayload;
  try {
    challenge = readChallengePayload(encodedPayload) as ChallengePayload;
  } catch {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }

  if (!challenge || !Number.isFinite(challenge.expiresAt) || challenge.expiresAt <= Date.now()) {
    response(res, 400, { code: 'otp_expired', error: 'That verification code has expired.' });
    return;
  }

  const resendApiKey = env.RESEND_API_KEY?.trim();
  if (challenge.mode !== 'email' || !challenge.digest || !challenge.email || !challenge.fullName || !signature || !resendApiKey) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }

  if (!verifySignature(encodedPayload, signature, resendApiKey)) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }
  if (!verifySignature(code, challenge.digest, resendApiKey)) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not correct.' });
    return;
  }

  const sessionPayload = {
    email: challenge.email,
    fullName: challenge.fullName,
    expiresAt: Date.now() + sessionLifetimeSeconds * 1000,
  };
  const sessionToken = makeChallenge(sessionPayload, resendApiKey);
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `elitepro_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionLifetimeSeconds}${secure}`);
  res.setHeader('Cache-Control', 'no-store');
  response(res, 200, {
    verified: true,
    profile: { email: challenge.email, fullName: challenge.fullName, verified: true },
  });
}
