// import { NextRequest, NextResponse } from "next/server";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api";

// const PUBLIC_PATHS = [
//   "/",
//   "/login",
//   "/sign-up",
//   "/forgot-password",
//   "/privecy-policy",
//   "/tearm-condition",
// ];

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip middleware for static files, images, API and public assets
//   if (
//     pathname === "/favicon.ico" ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api/") ||
//     pathname.startsWith("/public")
//   ) {
//     return NextResponse.next();
//   }

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-pathname", pathname);

//   const tokenQuery = request.nextUrl.searchParams.get("auth");
//   const cookieToken = request.cookies.get("accessToken")?.value;

//   const redirectToLogin = () => {
//     const res = NextResponse.redirect(new URL("/login", request.url));
//     res.cookies.delete("accessToken");
//     res.cookies.delete("accessTokenIssuedAt");
//     return res;
//   };

//   const redirectToHome = () => {
//     const res = NextResponse.redirect(new URL("/mu/home", request.url));
//     if (currentToken)
//       res.cookies.set("accessToken", currentToken, { path: "/", maxAge: 7 * 24 * 60 * 60 });
//     return res;
//   };

//   let response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });

//   let currentToken = cookieToken || null;

//   if (tokenQuery) {
//     try {
//       const decoded = JSON.parse(atob(tokenQuery));
//       if (decoded?.token) {
//         currentToken = decoded.token;
//         response.cookies.set("accessToken", currentToken, {
//           path: "/",
//           maxAge: 7 * 24 * 60 * 60,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//         });
//       }
//     } catch {
//       return redirectToLogin();
//     }
//   }

//   if (!currentToken) {
//     const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));
//     if (isPublic || pathname.startsWith("/onboarding")) {
//       return response;
//     }
//     return redirectToLogin();
//   }

//   if (PUBLIC_PATHS.some((path) => pathname === path)) {
//     return redirectToHome();
//   }

//   try {
//     const userResponse = await fetch(`${API_BASE_URL}/me`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${currentToken}`,
//         Accept: "application/json",
//       },
//       credentials: "include",
//     });

//     if (userResponse.ok) {
//       const userData = await userResponse.json();
//       if (userData?.success) {
//         if (!userData?.is_onboarding) {
//           if (!pathname.startsWith("/onboarding")) {
//             const res = NextResponse.redirect(new URL("/onboarding", request.url));
//             if (currentToken)
//               res.cookies.set("accessToken", currentToken, { path: "/", maxAge: 7 * 24 * 60 * 60 });
//             return res;
//           }
//         } else {
//           if (pathname.startsWith("/onboarding")) {
//             return redirectToHome();
//           }
//         }
//       }
//     }

//   } catch (error) {
//     console.error("Middleware token check bypassed on error:", error);
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { COOKIE_MAX_AGE } from "./lib/token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vini.pixelstack.cloud/api";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/privecy-policy",
  "/tearm-condition",
  "/two-factor",
  "/backup-codes",
  "/recovery-email",
  "/email-verify-code",
  "/account-recovery",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get("accessToken")?.value;
  const tokenQuery = request.nextUrl.searchParams.get("auth");
  let currentToken = cookieToken || null;


  if (tokenQuery) {
  try {
    const decoded = JSON.parse(atob(tokenQuery));
    if (decoded?.token) {
      const newToken = decoded.token;

      const url = request.nextUrl.clone();
      url.searchParams.delete("auth");
      
      const response = NextResponse.redirect(url);
      
      response.cookies.set("accessToken", newToken, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: true,
      });

      response.cookies.set("tokenIssueAt", new Date().toISOString(), {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: true,
      });
      
      return response;
    }
  } catch (e) {
    console.error("Token decoding failed");
  }
}

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path),
  );


  if (!currentToken) {
    if (isPublicPath || pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }


  if (isPublicPath) {
    if (pathname === "/login" || pathname === "/" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL("/mu/home", request.url));
    }
    return NextResponse.next();
  }

  try {

    let userResponse = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/json",
      },
    });

    if (userResponse.status === 401) {
      console.log("Access token expired, attempting refresh...");

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: "application/json",
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData?.data?.token || refreshData?.token;

          if (newToken) {
            const response = NextResponse.next();
            response.cookies.set("accessToken", newToken, {
              path: "/",
              maxAge: COOKIE_MAX_AGE,
              sameSite: "lax",
              secure: true,
            });
            return response;
          }
        }

        if (refreshResponse.status === 401 || refreshResponse.status === 403) {
          const res = NextResponse.redirect(new URL("/login", request.url));
          res.cookies.delete("accessToken");
          return res;
        }
      } catch (refreshErr) {
        console.error("Network error during refresh, session preserved.");
        return NextResponse.next();
      }
    }

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const isOnboarded =
        userData?.data?.is_onboarding ?? userData?.is_onboarding;

      if (!isOnboarded) {
        if (!pathname.startsWith("/onboarding")) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      } else {
        if (pathname.startsWith("/onboarding")) {
          return NextResponse.redirect(new URL("/mu/home", request.url));
        }
      }
    }
  } catch (error) {
    console.error("Middleware Auth Fetch Error:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
