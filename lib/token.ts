import nookies from "nookies";

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_ISSUED_AT_KEY = "accessTokenIssuedAt";



 export const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export async function setToken(token: string) {
  const now = Date.now().toString();

  const cookieOptions = {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      cookieStore.set(ACCESS_TOKEN_KEY, token, cookieOptions);
      cookieStore.set(ACCESS_TOKEN_ISSUED_AT_KEY, now, cookieOptions);
      return;
    } catch {
      // fallback
    }
  }

  nookies.set(null, ACCESS_TOKEN_KEY, token, cookieOptions);
  nookies.set(null, ACCESS_TOKEN_ISSUED_AT_KEY, now, cookieOptions);
}

export async function getToken() {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(ACCESS_TOKEN_KEY)?.value || null;
    } catch {
      return null;
    }
  }

  const cookies = nookies.get(null);
  return cookies[ACCESS_TOKEN_KEY] || null;
}

export async function getTokenIssuedAt() {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const value = cookieStore.get(ACCESS_TOKEN_ISSUED_AT_KEY)?.value;
      if (!value) return null;
      const issuedAt = Number(value);
      return Number.isNaN(issuedAt) ? null : issuedAt;
    } catch {
      return null;
    }
  }

  const cookies = nookies.get(null);
  const value = cookies[ACCESS_TOKEN_ISSUED_AT_KEY];

  if (!value) return null;
  const issuedAt = Number(value);
  return Number.isNaN(issuedAt) ? null : issuedAt;
}

export async function clearToken() {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      cookieStore.delete(ACCESS_TOKEN_KEY);
      cookieStore.delete(ACCESS_TOKEN_ISSUED_AT_KEY);
      return;
    } catch {
      // fallback
    }
  }

  nookies.destroy(null, ACCESS_TOKEN_KEY, { path: "/" });
  nookies.destroy(null, ACCESS_TOKEN_ISSUED_AT_KEY, { path: "/" });
}
