import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT, signJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    const payload = token ? await verifyJWT(token) : null;

    if (!payload || !payload.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update the database
    await sql`
      UPDATE users 
      SET has_premium_accessory = TRUE
      WHERE id = ${payload.userId}
    `;

    // Sign a new token with updated payload
    const newToken = await signJWT({
      ...payload,
      hasPremiumAccessory: true,
    });

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4, // Keep existing maxAge strategy or just overwrite
    };

    const response = NextResponse.json({ message: "Purchase successful" });
    response.cookies.set("auth_token", newToken, cookieOptions);

    return response;
  } catch (error) {
    console.error("Error updating premium accessory:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
