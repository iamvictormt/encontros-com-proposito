import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload || !payload.isAdmin) return null;

  return payload;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  try {
    const plans = await sql`
      SELECT id, name, description, amount, created_at, updated_at
      FROM subscription_plans
      ORDER BY amount ASC
    `;
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Admin fetch subscription plans error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  try {
    const { id, name, description, amount } = await request.json();

    if (!id || !name || amount === undefined) {
      return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      return NextResponse.json({ message: "Preço inválido" }, { status: 400 });
    }

    const updated = await sql`
      UPDATE subscription_plans
      SET name = ${name},
          description = ${description || null},
          amount = ${numericAmount},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, description, amount, updated_at
    `;

    if (updated.length === 0) {
      return NextResponse.json({ message: "Plano não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Admin update subscription plan error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
