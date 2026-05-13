import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-for-development-only",
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  const { pathname } = request.nextUrl;

  // Paths that are public (don't need auth)
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/privacy" ||
    pathname === "/terms-conditions" ||
    pathname === "/consent" ||
    pathname === "/security" ||
    pathname === "/cookies" ||
        pathname === "/faq" ||

    pathname === "/" ||
    pathname.startsWith("/api/premium/register") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/api/auth");

  const hasVisitedLanding = request.cookies.get("visited_landing")?.value === "true";

  if (!token) {
    // If visiting landing page, set the visited cookie
    if (pathname === "/") {
      const response = NextResponse.next();
      response.cookies.set("visited_landing", "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    // Mandatory landing page visit for login/signup/protected routes
    if (!hasVisitedLanding && (pathname === "/login" || pathname === "/signup" || !isPublicPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Standard protected route check
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // If already logged in and trying to access login/signup/home
      if (isPublicPath && (pathname === "/login" || pathname === "/signup" || pathname === "/")) {
        if (payload.isAdmin) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/events", request.url));
      }

      // If an admin tries to access user pages (anything not starting with /admin, /api or auth), redirect to admin
      if (
        payload.isAdmin &&
        !pathname.startsWith("/admin") &&
        !pathname.startsWith("/api") &&
        !isPublicPath
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Check admin status for specific routes
      if (pathname.startsWith("/admin") && !payload.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Check verification status (only for non-admin users)
      if (!payload.isAdmin) {
        const isVerified = payload.verificationStatus === "APROVADO";
        const isVerificationPage = pathname === "/em-analise";
        const isPremiumFlowPage = pathname === "/premium-flow";
        const userCategory = payload.userCategory as string;
        const hasPremiumAccessory = payload.hasPremiumAccessory as boolean;

        // Force PREMIUM users to buy accessory first
        if (userCategory === "PREMIUM" && !hasPremiumAccessory) {
          if (!isPremiumFlowPage && !isPublicPath) {
            return NextResponse.redirect(new URL("/premium-flow", request.url));
          }
        } else if (userCategory === "PREMIUM" && hasPremiumAccessory) {
          // If PREMIUM user already bought, they cannot access subscriptions
          if (pathname.startsWith("/subscriptions")) {
            return NextResponse.redirect(new URL("/events", request.url));
          }
          if (isPremiumFlowPage) {
            return NextResponse.redirect(new URL("/events", request.url));
          }
        }

        // If not verified and not already on the verification page, premium flow page, or public paths, redirect to verification
        if (!isVerified && !isVerificationPage && !isPremiumFlowPage && !isPublicPath) {
          return NextResponse.redirect(new URL("/em-analise", request.url));
        }

        // If verified and trying to access the verification page, redirect to home
        if (isVerified && isVerificationPage) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    } catch (error) {
      // Token is invalid, remove it and redirect to login if it's not a public path
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|images|videos|.*\\.(?:png|jpg|jpeg|svg|gif|webp)).*)",
  ],
};
