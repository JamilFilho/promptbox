import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "promptbox_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  userId: string;
  email: string;
  exp: number;
};

function getSessionSecret() {
  return process.env.SESSION_SECRET || "dev-only-session-secret-change-me";
}

function toBase64Url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(data: string) {
  return createHmac("sha256", getSessionSecret()).update(data).digest("hex");
}

export function createSessionToken(data: { userId: string; email: string }) {
  const payload: SessionPayload = {
    userId: data.userId,
    email: data.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expBuffer)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload?.userId || !payload?.email || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    },
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
