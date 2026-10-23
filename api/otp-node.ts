import { Buffer } from 'node:buffer';
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

export function randomOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function signValue(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function verifySignature(value: string, signature: string, secret: string): boolean {
  try {
    const expected = Buffer.from(signValue(value, secret), 'base64url');
    const provided = Buffer.from(signature, 'base64url');
    return expected.length === provided.length && timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}

export function makeChallenge(payload: unknown, secret?: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return secret ? `${encodedPayload}.${signValue(encodedPayload, secret)}` : encodedPayload;
}

export function readChallengePayload(value: string): unknown {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}
