import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";

export async function PUT(request: Request) {
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

    const data = await request.json();
    const { documentUrl, companyDocsUrl, partnerDocsUrl } = data;

    let updateQuery = sql`UPDATE users SET verification_status = 'EM_ANALISE'`;
    
    if (documentUrl) {
      await sql`UPDATE users SET document_url = ${documentUrl}, verification_status = 'EM_ANALISE' WHERE id = ${payload.userId}`;
    } else if (companyDocsUrl) {
      await sql`UPDATE users SET company_docs_url = ${companyDocsUrl}, verification_status = 'EM_ANALISE' WHERE id = ${payload.userId}`;
    } else if (partnerDocsUrl) {
      await sql`UPDATE users SET partner_docs_url = ${partnerDocsUrl}, verification_status = 'EM_ANALISE' WHERE id = ${payload.userId}`;
    }

    return NextResponse.json({ message: "Documentos enviados com sucesso e status atualizado para Em Análise." }, { status: 200 });

  } catch (error) {
    console.error("Document update error:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
