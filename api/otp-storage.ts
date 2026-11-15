import { env } from 'node:process';

type RpcResponse = Record<string, unknown>;

type HttpResponse = {
  status: number;
  text: () => Promise<string>;
};

function getSupabaseCredentials() {
  const url = env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) throw new Error('OTP storage is not configured.');
  return { url, serviceRoleKey };
}

async function callOtpRpc<T extends RpcResponse | null>(name: string, payload: Record<string, unknown>): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseCredentials();
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  }) as unknown as HttpResponse;
  const body = await response.text();
  if (response.status < 200 || response.status >= 300) throw new Error('OTP storage request failed.');
  return (body ? JSON.parse(body) : null) as T;
}

export type IssueOtpResult = {
  challengeId?: string;
  expiresInSeconds?: number;
  error?: string;
  retryAfterSeconds?: number;
};

export type VerifyOtpResult = {
  verified?: boolean;
  email?: string;
  fullName?: string;
  error?: string;
};

export function isOtpStorageConfigured() {
  return Boolean(env.SUPABASE_URL?.trim() && env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function issueOtpChallenge(input: {
  email: string;
  fullName: string;
  codeDigest: string;
  ipDigest: string;
  expiresAt: string;
}) {
  return callOtpRpc<IssueOtpResult>('issue_elitepro_email_otp', {
    p_email: input.email,
    p_full_name: input.fullName,
    p_code_digest: input.codeDigest,
    p_ip_digest: input.ipDigest,
    p_expires_at: input.expiresAt,
  });
}

export function verifyOtpChallenge(challengeId: string, codeDigest: string) {
  return callOtpRpc<VerifyOtpResult>('verify_elitepro_email_otp', {
    p_challenge_id: challengeId,
    p_code_digest: codeDigest,
  });
}

