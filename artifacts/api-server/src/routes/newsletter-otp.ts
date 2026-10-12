import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { Router, type IRouter, type Response } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  type OtpError,
  SendNewsletterOtpBody,
  SendNewsletterOtpResponse,
  VerifyNewsletterOtpBody,
  VerifyNewsletterOtpResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const challengeLifetimeMs = 10 * 60 * 1000;
const resendCooldownMs = 60 * 1000;
const emailLimitWindowMs = 60 * 60 * 1000;
const maxEmailSendsPerHour = 3;

type Challenge = { email: string; digest: Buffer; expiresAt: number; attempts: number };
type RateBucket = { timestamps: number[]; lastSentAt: number };

const challenges = new Map<string, Challenge>();
const emailRate = new Map<string, RateBucket>();

function responseError(res: Response, status: number, code: string, error: string) {
  const payload: OtpError = { code, error };
  res.status(status).json(payload);
}

function currentSecret() {
  return process.env.SESSION_SECRET;
}

function digestCode(challengeId: string, code: string, secret: string) {
  return createHmac("sha256", secret).update(`${challengeId}:${code}`).digest();
}

function cleanupExpired(now: number) {
  for (const [id, challenge] of challenges) {
    if (challenge.expiresAt <= now) challenges.delete(id);
  }
  for (const [key, bucket] of emailRate) {
    bucket.timestamps = bucket.timestamps.filter((timestamp) => now - timestamp < emailLimitWindowMs);
    if (!bucket.timestamps.length && now - bucket.lastSentAt >= emailLimitWindowMs) emailRate.delete(key);
  }
}

function emailFingerprint(email: string, secret: string) {
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

function encodeMail(to: string, code: string) {
  const message = [
    `To: ${to}`,
    "Subject: Elite Pro Services email verification",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    `Your Elite Pro Services verification code is ${code}. It expires in 10 minutes.`,
    `رمز التحقق ديالك هو ${code}. الصلاحية ديالو 10 دقايق.`,
    "",
  ].join("\r\n");

  return Buffer.from(message, "utf8").toString("base64url");
}

router.post("/newsletter/otp", async (req, res): Promise<void> => {
  const parsed = SendNewsletterOtpBody.safeParse(req.body);
  if (!parsed.success) {
    responseError(res, 400, "invalid_email", "Enter a valid Gmail address.");
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();
  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    responseError(res, 400, "gmail_only", "Use an address ending in @gmail.com.");
    return;
  }

  const secret = currentSecret();
  if (!secret) {
    responseError(res, 503, "otp_not_configured", "Email verification is not configured.");
    return;
  }

  const now = Date.now();
  cleanupExpired(now);
  const fingerprint = emailFingerprint(email, secret);
  const emailBucket = emailRate.get(fingerprint) ?? { timestamps: [], lastSentAt: 0 };

  if (
    now - emailBucket.lastSentAt < resendCooldownMs ||
    emailBucket.timestamps.length >= maxEmailSendsPerHour
  ) {
    responseError(res, 429, "rate_limited", "Please wait before requesting another code.");
    return;
  }

  const challengeId = randomUUID();
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const connectors = new ReplitConnectors();

  try {
    const upstream = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { raw: encodeMail(email, code) },
    });

    if (upstream.status === 401 || upstream.status === 403 || upstream.status === 404) {
      responseError(res, 503, "mail_not_connected", "Gmail is not connected or does not have permission to send.");
      return;
    }
    if (!upstream.ok) {
      req.log.warn({ upstreamStatus: upstream.status }, "Gmail rejected an OTP message.");
      responseError(res, 502, "mail_delivery_failed", "Gmail could not deliver the verification email.");
      return;
    }
  } catch {
    req.log.warn("Gmail connector is unavailable for OTP delivery.");
    responseError(res, 503, "mail_not_connected", "Gmail is not connected or is unavailable.");
    return;
  }

  challenges.set(challengeId, {
    email,
    digest: digestCode(challengeId, code, secret),
    expiresAt: now + challengeLifetimeMs,
    attempts: 0,
  });
  emailBucket.timestamps.push(now);
  emailBucket.lastSentAt = now;
  emailRate.set(fingerprint, emailBucket);

  res.status(202).json(SendNewsletterOtpResponse.parse({
    challengeId,
    expiresInSeconds: Math.floor(challengeLifetimeMs / 1000),
  }));
});

router.post("/newsletter/verify", (req, res): void => {
  const parsed = VerifyNewsletterOtpBody.safeParse(req.body);
  if (!parsed.success) {
    responseError(res, 400, "invalid_code", "Enter the six-digit code from your email.");
    return;
  }

  const secret = currentSecret();
  if (!secret) {
    responseError(res, 503, "otp_not_configured", "Email verification is not configured.");
    return;
  }

  const now = Date.now();
  const challenge = challenges.get(parsed.data.challengeId);
  if (!challenge || challenge.expiresAt <= now) {
    if (challenge) challenges.delete(parsed.data.challengeId);
    responseError(res, 400, "otp_expired", "That verification code has expired. Request a new one.");
    return;
  }

  challenge.attempts += 1;
  const received = digestCode(parsed.data.challengeId, parsed.data.code, secret);
  if (!timingSafeEqual(challenge.digest, received)) {
    if (challenge.attempts >= 5) {
      challenges.delete(parsed.data.challengeId);
      responseError(res, 429, "attempt_limit", "Too many incorrect attempts. Request a new code.");
      return;
    }
    responseError(res, 400, "invalid_code", "That code is not correct.");
    return;
  }

  challenges.delete(parsed.data.challengeId);
  res.json(VerifyNewsletterOtpResponse.parse({ verified: true }));
});

export default router;
