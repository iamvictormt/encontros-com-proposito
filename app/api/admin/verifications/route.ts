import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
    }

    const results = await sql`
      SELECT id, full_name, email, phone, user_category, verification_status,
             document_url, company_docs_url, partner_docs_url, created_at
      FROM users
      WHERE verification_status IN ('PENDENTE', 'EM_ANALISE')
      AND is_admin = false
      ORDER BY created_at ASC
    `;

    return NextResponse.json(results);
  } catch (error) {
    console.error("Admin verifications error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
