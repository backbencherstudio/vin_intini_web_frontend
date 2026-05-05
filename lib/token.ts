import nookies from "nookies";

const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_ISSUED_AT_KEY = "accessTokenIssuedAt";

export async function setToken(token: string) {
  const now = Date.now().toString();

  nookies.set(null, ACCESS_TOKEN_KEY, token, {
    path: "/",
  });

  nookies.set(null, ACCESS_TOKEN_ISSUED_AT_KEY, now, {
    path: "/",
  });
}

export async function getToken() {
  const cookies = nookies.get(null);
  return cookies[ACCESS_TOKEN_KEY] || null;
}

export async function getTokenIssuedAt() {
  const cookies = nookies.get(null);
  const value = cookies[ACCESS_TOKEN_ISSUED_AT_KEY];

  if (!value) {
    return null;
  }

  const issuedAt = Number(value);
  return Number.isNaN(issuedAt) ? null : issuedAt;
}

export async function clearToken() {
  nookies.destroy(null, ACCESS_TOKEN_KEY, {
    path: "/",
  });

  nookies.destroy(null, ACCESS_TOKEN_ISSUED_AT_KEY, {
    path: "/",
  });
}
