import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public pages (auth-related, API routes, and onboarding)
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Get token from cookies or query params
  const token = request.nextUrl.searchParams.get("auth");
  const cookieToken = request.cookies.get("accessToken")?.value;
  const hasToken = token || cookieToken;

  // If no token, redirect to login
  if (!hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token from query param, decode and set cookie
  let response = NextResponse.next();
  let currentToken = cookieToken;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token)).token;
      response.cookies.set("accessToken", decodedToken, {
        path: "/",
        httpOnly: false,
        maxAge: undefined,
      });
      currentToken = decodedToken;
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Check onboarding status by calling /me API
  if (currentToken) {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          accept: "application/json",
        },
        credentials: "include",
      });
      const userData = await userResponse.json();
     

      if (userData.success) {
        // If onboarding is incomplete (is_onboarding === false), redirect to onboarding

        if (!userData?.is_onboarding) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      } else if (userResponse.status === 401) {
        // Token expired or invalid
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      // If API call fails, log and continue
      console.error("Failed to fetch user profile in middleware:", error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
