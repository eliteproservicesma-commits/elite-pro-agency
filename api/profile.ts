import { env } from 'node:process';
import { readChallengePayload, verifySignature } from './otp-node';

type ApiRequest = {
  method?: string;
  headers?: { cookie?: string | string[] };
};
type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};
type SessionPayload = { email: string; fullName: string; expiresAt: number };

const cookieName = 'elitepro_session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

function response(res: ApiResponse, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function sessionCookie(value: string, maxAge: number) {
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function readCookie(request: ApiRequest): string | null {
  const header = request.headers?.cookie;
  const cookieHeader = Array.isArray(header) ? header.join(';') : header;
  if (typeof cookieHeader !== 'string') return null;
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  return entry?.slice(cookieName.length + 1) ?? null;
}

function readSession(token: string, secret: string): SessionPayload | null {
  const [encodedPayload, signature, ...extra] = token.split('.');
  if (!encodedPayload || !signature || extra.length > 0 || !verifySignature(encodedPayload, signature, secret)) return null;

  try {
    const payload = readChallengePayload(encodedPayload) as Partial<SessionPayload>;
    if (
      typeof payload.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
      typeof payload.fullName !== 'string' ||
      !Number.isFinite(payload.expiresAt) ||
      (payload.expiresAt ?? 0) <= Date.now()
    ) return null;
    return { email: payload.email, fullName: payload.fullName, expiresAt: payload.expiresAt as number };
  } catch {
    return null;
  }
}

export default async function handler(request: ApiRequest, res: ApiResponse): Promise<void> {
  if (request.method === 'DELETE') {
    res.setHeader('Set-Cookie', sessionCookie('', 0));
    response(res, 200, { signedOut: true });
    return;
  }

  if (request.method !== 'GET') {
    res.setHeader('Allow', 'GET, DELETE');
    response(res, 405, { error: 'Use GET or DELETE.' });
    return;
  }

  const secret = env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  const token = readCookie(request);
  const session = secret && token ? readSession(token, secret) : null;
  if (!session) {
    response(res, 401, { profile: null });
    return;
  }

  response(res, 200, {
    profile: { email: session.email, fullName: session.fullName, verified: true },
  });
}
