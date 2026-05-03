import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { neon } from '@neondatabase/serverless';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getUserSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const result = await sql`
      UPDATE physical_card_requests
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Erro ao atualizar solicitação de cartão:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
