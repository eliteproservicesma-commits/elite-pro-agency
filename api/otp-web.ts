export type EdgeRequest = {
  method: string;
  json: () => Promise<unknown>;
};

export type EdgeResponse = {
  readonly status: number;
  readonly statusText: string;
  readonly headers: { get: (name: string) => string | null };
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly type: string;
  readonly url: string;
  readonly bodyUsed: boolean;
  arrayBuffer: () => Promise<unknown>;
  blob: () => Promise<unknown>;
  clone: () => EdgeResponse;
  formData: () => Promise<unknown>;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
};

type CryptoKeyLike = object;
type EdgeRuntime = {
  fetch: (
    input: string,
    init: { method: 'POST'; headers: Record<string, string>; body: string },
  ) => Promise<{ ok: boolean }>;
  crypto: {
    getRandomValues: <T extends Uint32Array>(array: T) => T;
    subtle: {
      importKey: (
        format: 'raw',
        keyData: Uint8Array,
        algorithm: { name: 'HMAC'; hash: 'SHA-256' },
        extractable: boolean,
        keyUsages: ('sign' | 'verify')[],
      ) => Promise<CryptoKeyLike>;
      sign: (algorithm: { name: 'HMAC' }, key: CryptoKeyLike, data: Uint8Array) => Promise<ArrayBuffer>;
      verify: (
        algorithm: { name: 'HMAC' },
        key: CryptoKeyLike,
        signature: Uint8Array,
        data: Uint8Array,
      ) => Promise<boolean>;
    };
  };
  btoa: (value: string) => string;
  atob: (value: string) => string;
  Response: new (
    body: string,
    init: { status: number; headers: Record<string, string> },
  ) => EdgeResponse;
};

const web = globalThis as unknown as EdgeRuntime;

declare const process: { env: { RESEND_API_KEY?: string } };

export function getResendApiKey(): string | undefined {
  return typeof process === 'undefined' ? undefined : process.env.RESEND_API_KEY;
}

export function jsonResponse(status: number, body: unknown): EdgeResponse {
  return new web.Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export function randomOtp(): string {
  const range = 0x1_0000_0000;
  const acceptedRange = Math.floor(range / 1_000_000) * 1_000_000;
  const value = new Uint32Array(1);
  do {
    web.crypto.getRandomValues(value);
  } while (value[0] >= acceptedRange);
  return String(value[0] % 1_000_000).padStart(6, '0');
}

function asciiBytes(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) bytes[index] = value.charCodeAt(index);
  return bytes;
}

function toBase64Url(value: string): string {
  let binary = '';
  for (const byte of asciiBytes(value)) binary += String.fromCharCode(byte);
  return web.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = web.atob(base64);
  let decoded = '';
  for (let index = 0; index < binary.length; index += 1) decoded += String.fromCharCode(binary.charCodeAt(index));
  return decoded;
}

function fromBase64UrlBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = web.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKeyLike> {
  return web.crypto.subtle.importKey(
    'raw',
    asciiBytes(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signValue(value: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = new Uint8Array(await web.crypto.subtle.sign({ name: 'HMAC' }, key, asciiBytes(value)));
  let binary = '';
  for (const byte of signature) binary += String.fromCharCode(byte);
  return web.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function verifySignature(value: string, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await hmacKey(secret);
    return await web.crypto.subtle.verify(
      { name: 'HMAC' },
      key,
      fromBase64UrlBytes(signature),
      asciiBytes(value),
    );
  } catch {
    return false;
  }
}

export async function makeChallenge(payload: unknown, secret?: string): Promise<string> {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  if (!secret) return encodedPayload;
  return `${encodedPayload}.${await signValue(encodedPayload, secret)}`;
}

export function readChallengePayload(value: string): unknown {
  return JSON.parse(fromBase64Url(value));
}

export function sendResendEmail(apiKey: string, email: string, code: string): Promise<{ ok: boolean }> {
  return web.fetch('https://api.resend.com/emails', {
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
}
