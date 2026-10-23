import { Buffer } from 'node:buffer';
import { createHmac, randomInt } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import process from 'node:process';

type ResendRequestInit = {
  method: 'POST';
  headers: Record<string, string>;
  body: string;
};
type ResendResponse = { ok: boolean };

function resendFetch(url: string, init: ResendRequestInit): Promise<ResendResponse> {
  const runtime = globalThis as typeof globalThis & {
    fetch: (input: string, options: ResendRequestInit) => Promise<ResendResponse>;
  };
  return runtime.fetch(url, init);
}

type ApiRequest = IncomingMessage & { body?: unknown };
type ApiResponse = ServerResponse & {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
};
type ChallengePayload = { mode: 'email' | 'mock'; expiresAt: number; digest?: string };
type SendWindow = { sentAt: number[] };

const challengeLifetimeMs = 10 * 60 * 1000;
const resendCooldownMs = 60 * 1000;
const hourlyLimit = 3;
const sendWindows = new Map<string, SendWindow>();

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

function makeChallenge(payload: ChallengePayload, secret?: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return secret ? `${encodedPayload}.${sign(encodedPayload, secret)}` : encodedPayload;
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
  const email = body && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';
  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    return json(response, 400, { code: 'invalid_email', error: 'Enter a valid Gmail address.' });
  }

  const now = Date.now();
  const window = sendWindows.get(email) ?? { sentAt: [] };
  window.sentAt = window.sentAt.filter((sentAt) => now - sentAt < 60 * 60 * 1000);
  if (window.sentAt.length && now - window.sentAt[window.sentAt.length - 1] < resendCooldownMs) {
    return json(response, 429, { code: 'resend_wait', error: 'Please wait before requesting another code.' });
  }
  if (window.sentAt.length >= hourlyLimit) {
    return json(response, 429, { code: 'rate_limited', error: 'Too many requests. Try again later.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const code = apiKey ? randomInt(0, 1_000_000).toString().padStart(6, '0') : '123456';
  const expiresAt = now + challengeLifetimeMs;
  let challengeId: string;

  if (apiKey) {
    const digest = sign(code, apiKey);
    const delivery = await resendFetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Elite Pro Services <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Elite Pro Services verification code',
        text: `Your verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your Elite Pro Services verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
      }),
    });

    if (!delivery.ok) {
      return json(response, 502, { code: 'email_delivery_failed', error: 'The verification email could not be sent.' });
    }
    challengeId = makeChallenge({ mode: 'email', expiresAt, digest }, apiKey);
  } else {
    challengeId = makeChallenge({ mode: 'mock', expiresAt });
  }

  window.sentAt.push(now);
  sendWindows.set(email, window);
  return json(response, 200, {
    challengeId,
    expiresInSeconds: Math.floor(challengeLifetimeMs / 1000),
    mode: apiKey ? 'email' : 'mock',
    ...(apiKey ? {} : { mockCode: code }),
  });
}
