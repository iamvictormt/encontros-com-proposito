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

    if (!payload) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const results = await sql`
      SELECT id, full_name, email, phone, birth_date, is_admin, 
             subscription_status, subscription_plan, subscription_expiry,
             user_category, verification_status, document_url, company_docs_url, partner_docs_url
      FROM users
      WHERE id = ${payload.userId}
    `;

    if (results.length === 0) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 401 });
    }

    const user = results[0];

    return NextResponse.json(
      {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          birthDate: user.birth_date,
          isAdmin: user.is_admin,
          subscriptionStatus: user.subscription_status,
          subscriptionPlan: user.subscription_plan,
          subscriptionExpiry: user.subscription_expiry,
          userCategory: user.user_category,
          verificationStatus: user.verification_status,
          documentUrl: user.document_url,
          companyDocsUrl: user.company_docs_url,
          partnerDocsUrl: user.partner_docs_url,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
