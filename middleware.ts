import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for auth-related pages and API routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
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

  // Skip onboarding check for onboarding page itself
  if (pathname.startsWith("/onboarding")) {
    return response;
  }

  // Check onboarding status
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

      if (userResponse.ok) {
        const userData = await userResponse.json();

        // If onboarding is incomplete, redirect to onboarding page
        if (!userData?.data?.is_onboarding) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }
    } catch (error) {
      // If API call fails, continue (don't block)
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
