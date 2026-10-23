import { readChallengePayload, verifySignature } from './otp-node';
import { env } from 'node:process';

type ApiRequest = { method?: string; body: unknown };
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
};
type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
const testCode = '123456';

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

  if (challenge.mode === 'mock') {
    if (signature !== undefined || env.NODE_ENV === 'production') {
      response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
      return;
    }
    if (code !== testCode) {
      response(res, 400, { code: 'invalid_code', error: 'That code is not correct.' });
      return;
    }
    response(res, 200, { verified: true });
    return;
  }

  const appPassword = env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (challenge.mode !== 'email' || !challenge.digest || !signature || !appPassword) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }

  if (!verifySignature(encodedPayload, signature, appPassword)) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not valid.' });
    return;
  }
  if (!verifySignature(code, challenge.digest, appPassword)) {
    response(res, 400, { code: 'invalid_code', error: 'That code is not correct.' });
    return;
  }

  response(res, 200, { verified: true });
}
