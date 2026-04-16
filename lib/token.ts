import nookies from "nookies";

export async function setToken(token: string, maxAge = 60 * 60) {
  nookies.set(null, "accessToken", token, {
    maxAge,
    path: "/",
  });
}

export async function getToken() {
  const cookies = nookies.get(null);
  return cookies.accessToken || null;
}

export async function clearToken() {
  nookies.destroy(null, "accessToken", {
    path: "/",
  });
}
