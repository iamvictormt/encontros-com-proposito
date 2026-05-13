import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { signJWT, verifyJWT } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Nao autenticado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ message: "Token invalido" }, { status: 401 });
    }

    const { mode } = await request.json();
    const nextCategory = mode === "PREMIUM" ? "PREMIUM" : mode === "COMUM" ? "COMUM" : null;

    if (!nextCategory) {
      return NextResponse.json({ message: "Modo de perfil invalido" }, { status: 400 });
    }

    const currentUser = await sql`
      SELECT has_premium_accessory
      FROM users
      WHERE id = ${payload.userId}
    `;

    if (currentUser.length === 0) {
      return NextResponse.json({ message: "Usuario nao encontrado" }, { status: 404 });
    }

    if (!currentUser[0].has_premium_accessory) {
      return NextResponse.json(
        { message: "A troca de modo esta disponivel apenas para usuarios premium MeetOff" },
        { status: 403 },
      );
    }

    const result = await sql`
      UPDATE users
      SET user_category = ${nextCategory}
      WHERE id = ${payload.userId}
      RETURNING id, full_name, email, phone, birth_date, is_admin, user_category,
                verification_status, subscription_status, subscription_plan,
                subscription_expiry, has_premium_accessory
    `;

    const user = result[0];
    const nextToken = await signJWT({
      userId: user.id,
      email: user.email || "",
      isAdmin: user.is_admin || false,
      verificationStatus: user.verification_status,
      userCategory: user.user_category,
      hasPremiumAccessory: user.has_premium_accessory,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        birthDate: user.birth_date,
        isAdmin: user.is_admin,
        userCategory: user.user_category,
        verificationStatus: user.verification_status,
        subscriptionStatus: user.subscription_status,
        subscriptionPlan: user.subscription_plan,
        subscriptionExpiry: user.subscription_expiry,
        hasPremiumAccessory: user.has_premium_accessory,
      },
    });

    response.cookies.set("auth_token", nextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Profile mode update error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
