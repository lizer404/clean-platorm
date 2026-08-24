import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "cp_admin_session";
export const ADMIN_ROLE = "ADMIN" as const;

/** Local demo credentials */
export const ADMIN_DEMO_LOGIN = "admin";
export const ADMIN_DEMO_PASSWORD = "admin123";

const SECRET = "cleanplatform-admin-mock-secret-v1";

export type AdminSessionPayload = {
  role: typeof ADMIN_ROLE;
  login: string;
  exp: number;
};

function sign(payloadB64: string) {
  return createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

export function createAdminSessionToken(login: string, ttlMs = 1000 * 60 * 60 * 12) {
  const payload: AdminSessionPayload = {
    role: ADMIN_ROLE,
    login,
    exp: Date.now() + ttlMs,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function verifyAdminSessionToken(
  token: string | undefined | null,
): AdminSessionPayload | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;
  const expected = sign(payloadB64);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as AdminSessionPayload;
    if (payload.role !== ADMIN_ROLE) return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isAdminRole(token: string | undefined | null) {
  return verifyAdminSessionToken(token)?.role === ADMIN_ROLE;
}
