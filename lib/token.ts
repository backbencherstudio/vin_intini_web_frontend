// app/actions/auth.ts
"use server";

import { cookies } from "next/headers";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function setToken(token: string) {
  const cookieStore = await cookies();
  const now = Date.now().toString();

  cookieStore.set("accessToken", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  cookieStore.set("accessTokenIssuedAt", now, {
    httpOnly: false, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export async function clearToken() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("accessTokenIssuedAt");
}