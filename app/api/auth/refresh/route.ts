import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT, signJWT } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirect") || "/";

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/entrar", request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/entrar", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    // Query database for latest user info
    const results = await sql`
      SELECT id, email, is_admin, verification_status, user_category, has_premium_accessory
      FROM users
      WHERE id = ${payload.userId}
    `;

    if (results.length === 0) {
      const response = NextResponse.redirect(new URL("/entrar", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    const user = results[0];

    // Sign new JWT with updated status and information
    const newToken = await signJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      verificationStatus: user.verification_status,
      userCategory: user.user_category,
      hasPremiumAccessory: user.has_premium_accessory,
    });

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    response.cookies.set("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
