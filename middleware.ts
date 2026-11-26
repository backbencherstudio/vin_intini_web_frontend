import { NextRequest, NextResponse } from "next/server";
import { COOKIE_MAX_AGE } from "./lib/token";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://vini.softvenceomegaforce.cloud/api";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/admin/login",
  "/sign-up",
  "/forgot-password",
  "/privacy-policy",
  "/terms-conditions",
  "/two-factor",
  "/backup-codes",
  "/recovery-email",
  "/email-verify-code",
  "/account-recovery",
];

interface JwtPayload {
  sub?: number | string;
  role?: string;
  is_verified?: boolean;
  exp?: number;
  jti?: string;
  [key: string]: unknown;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now();
}

function setAuthCookie(response: NextResponse, token: string, isHttps = true) {
  response.cookies.set("accessToken", token, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: isHttps,
  });
  response.cookies.set("accessTokenIssuedAt", Date.now().toString(), {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: isHttps,
  });
  return response;
}

function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("accessToken");
  response.cookies.delete("accessTokenIssuedAt");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isHttps = request.nextUrl.protocol === "https:";

  // Static files and internal routes bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // 1. Support ?auth= query param token (e.g. social login callback)
  const cookieToken = request.cookies.get("accessToken")?.value || null;
  const tokenQuery = request.nextUrl.searchParams.get("auth");
  let currentToken = cookieToken;
  let tokenFromQuery: string | null = null;

  if (tokenQuery) {
    try {
      const decoded = JSON.parse(atob(tokenQuery));
      if (decoded?.token) {
        currentToken = decoded.token;
        tokenFromQuery = decoded.token;
      }
    } catch {
      // ignore
    }
  }

  let payload = currentToken ? parseJwtPayload(currentToken) : null;
  let expired = isTokenExpired(payload);

  // 2. Silent Refresh: If token expired, attempt server refresh before failing
  if (currentToken && expired) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: "application/json",
        },
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newToken = refreshData?.token || refreshData?.data?.token;
        if (newToken) {
          currentToken = newToken;
          tokenFromQuery = newToken;
          payload = parseJwtPayload(newToken);
          expired = false;
        }
      }
    } catch {
      // Network error or backend down
    }
  }

  const isValidToken = Boolean(currentToken && payload && !expired);
  const userRole = isValidToken ? payload?.role || "user" : null;
  const isAdmin = userRole === "admin" || userRole === "super-admin";

  // Header propagation for downstream components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);
  const segments = pathname.split("/").filter(Boolean);
  const lastParam = segments.length > 0 ? segments[segments.length - 1] : "";
  requestHeaders.set("x-current-params", lastParam);

  const createNextResponse = () => {
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    if (tokenFromQuery && currentToken) {
      response = setAuthCookie(response, currentToken, isHttps);
    }
    return response;
  };

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`)
  );

  // -------------------------------------------------------------
  // ROOT / LANDING PAGE GUARD (/)
  // -------------------------------------------------------------
  if (pathname === "/") {
    if (isValidToken) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/mu/home", request.url));
    }
    return createNextResponse();
  }

  // -------------------------------------------------------------
  // ADMIN ROUTES GUARD (/dashboard, /dashboard/*)
  // -------------------------------------------------------------
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/mu/home", request.url));
    }

    return createNextResponse();
  }

  // -------------------------------------------------------------
  // ADMIN LOGIN PAGE GUARD (/admin/login)
  // -------------------------------------------------------------
  if (pathname === "/admin/login") {
    if (isValidToken && isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return createNextResponse();
  }

  // -------------------------------------------------------------
  // PUBLIC AUTH ROUTES (/login, /sign-up)
  // -------------------------------------------------------------
  if (pathname === "/login" || pathname === "/sign-up") {
    if (isValidToken) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/mu/home", request.url));
    }
    return createNextResponse();
  }

  // -------------------------------------------------------------
  // USER PROTECTED ROUTES (/mu/*)
  // -------------------------------------------------------------
  if (pathname.startsWith("/mu/")) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return createNextResponse();
  }

  // -------------------------------------------------------------
  // ONBOARDING ROUTES GUARD (/onboarding, /onboarding/*)
  // -------------------------------------------------------------
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    try {
      const meRes = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.is_onboarding === true) {
          return NextResponse.redirect(new URL("/mu/home", request.url));
        }
      }
    } catch {
      // Fallback to client-side onboarding guard if /me check fails transiently
    }

    return createNextResponse();
  }

  // -------------------------------------------------------------
  // CATCH-ALL UNPROTECTED PRIVATE ROUTES
  // -------------------------------------------------------------
  if (!isValidToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return createNextResponse();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
