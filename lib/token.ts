import nookies from "nookies";

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_ISSUED_AT_KEY = "accessTokenIssuedAt";


// কুকি ব্রাউজারে ৩০ দিন পর্যন্ত পারসিস্ট করবে (ব্রাউজার কাটলেও থাকবে)
 export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export async function setToken(token: string) {
  const now = Date.now().toString();

  const cookieOptions = {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  nookies.set(null, ACCESS_TOKEN_KEY, token, cookieOptions);
  nookies.set(null, ACCESS_TOKEN_ISSUED_AT_KEY, now, cookieOptions);
}

export async function getToken() {
  const cookies = nookies.get(null);
  return cookies[ACCESS_TOKEN_KEY] || null;
}

export async function getTokenIssuedAt() {
  const cookies = nookies.get(null);
  const value = cookies[ACCESS_TOKEN_ISSUED_AT_KEY];

  if (!value) return null;
  const issuedAt = Number(value);
  return Number.isNaN(issuedAt) ? null : issuedAt;
}

export async function clearToken() {
  nookies.destroy(null, ACCESS_TOKEN_KEY, { path: "/" });
  nookies.destroy(null, ACCESS_TOKEN_ISSUED_AT_KEY, { path: "/" });
}
