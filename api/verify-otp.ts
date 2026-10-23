import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import process from 'node:process';

type ApiRequest = IncomingMessage & { body?: unknown };
type ApiResponse = ServerResponse & {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
};
type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
const testCode = '123456';

async function readBody(request: ApiRequest): Promise<unknown> {
  if (request.body && typeof request.body === 'object') return request.body;
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function json(response: ApiResponse, statusCode: number, body: unknown) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(statusCode).json(body);
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { code: 'method_not_allowed', error: 'Use POST.' });
  }

  const body = await readBody(request);
  const challengeId = body && typeof body === 'object' && 'challengeId' in body && typeof body.challengeId === 'string'
    ? body.challengeId
    : '';
  const code = body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
    ? body.code
    : '';
  if (!/^\d{6}$/.test(code) || !challengeId || challengeId.length > 2048) {
    return json(response, 400, { code: 'invalid_code', error: 'Enter the six-digit code.' });
  }

  const [encodedPayload, signature, extra] = challengeId.split('.');
  if (extra !== undefined) {
    return json(response, 400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  let challenge: ChallengePayload;
  try {
    challenge = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as ChallengePayload;
  } catch {
    return json(response, 400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  if (!challenge || !Number.isFinite(challenge.expiresAt) || challenge.expiresAt <= Date.now()) {
    return json(response, 400, { code: 'otp_expired', error: 'That verification code has expired.' });
  }

  if (challenge.mode === 'mock') {
    if (code !== testCode) return json(response, 400, { code: 'invalid_code', error: 'That code is not correct.' });
    return json(response, 200, { verified: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || challenge.mode !== 'email' || !challenge.digest || !signature) {
    return json(response, 400, { code: 'invalid_code', error: 'That code is not valid.' });
  }

  if (!safeEqual(sign(encodedPayload, apiKey), signature)) {
    return json(response, 400, { code: 'invalid_code', error: 'That code is not valid.' });
  }
  if (!safeEqual(sign(code, apiKey), challenge.digest)) {
    return json(response, 400, { code: 'invalid_code', error: 'That code is not correct.' });
  }

  return json(response, 200, { verified: true });
}
