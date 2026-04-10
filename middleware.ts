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
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/partners");

  if (!token && !isPublicPath) {
    // If not authenticated and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // If already logged in and trying to access login/signup
      if (isPublicPath && (pathname === "/login" || pathname === "/signup")) {
        if (payload.isAdmin) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
      }

      // If an admin tries to access user pages (anything not starting with /admin or auth), redirect to admin
      if (payload.isAdmin && !pathname.startsWith("/admin") && !isPublicPath) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Check admin status for specific routes
      if (pathname.startsWith("/admin") && !payload.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
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
