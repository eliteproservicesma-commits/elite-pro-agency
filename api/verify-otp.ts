import {
  getResendApiKey,
  jsonResponse,
  readChallengePayload,
  verifySignature,
  type EdgeRequest,
  type EdgeResponse,
} from './otp-web';

export const config = { runtime: 'edge' };

type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
const testCode = '123456';

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

  const challengeId = body && typeof body === 'object' && 'challengeId' in body && typeof body.challengeId === 'string'
    ? body.challengeId
    : '';
  const code = body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
    ? body.code
    : '';
  if (!/^\d{6}$/.test(code) || !challengeId || challengeId.length > 2048) {
    return jsonResponse(400, { code: 'invalid_code', error: 'Enter the six-digit code.' });
  }

  const [encodedPayload, signature, ...extra] = challengeId.split('.');
  if (extra.length > 0 || !encodedPayload) {
    return jsonResponse(400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  let challenge: ChallengePayload;
  try {
    challenge = readChallengePayload(encodedPayload) as ChallengePayload;
  } catch {
    return jsonResponse(400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  if (!challenge || !Number.isFinite(challenge.expiresAt) || challenge.expiresAt <= Date.now()) {
    return jsonResponse(400, { code: 'otp_expired', error: 'That verification code has expired.' });
  }

  if (challenge.mode === 'mock') {
    if (signature !== undefined) {
      return jsonResponse(400, { code: 'invalid_code', error: 'That code is not valid.' });
    }
    if (code !== testCode) return jsonResponse(400, { code: 'invalid_code', error: 'That code is not correct.' });
    return jsonResponse(200, { verified: true });
  }

  const apiKey = getResendApiKey();
  if (!apiKey || challenge.mode !== 'email' || !challenge.digest || !signature) {
    return jsonResponse(400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  if (!await verifySignature(encodedPayload, signature, apiKey)) {
    return jsonResponse(400, { code: 'invalid_code', error: 'That code is not valid.' });
  }
  if (!await verifySignature(code, challenge.digest, apiKey)) {
    return jsonResponse(400, { code: 'invalid_code', error: 'That code is not correct.' });
  }

  return jsonResponse(200, { verified: true });
}
