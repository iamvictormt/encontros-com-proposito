import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const session = await getUserSession();
  
  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    const requests = await sql`
      SELECT 
        r.id,
        r.user_id,
        r.card_id,
        r.full_name,
        r.cep,
        r.address,
        r.number,
        r.complement,
        r.neighborhood,
        r.city,
        r.state,
        r.status,
        r.amount,
        r.created_at,
        u.email as user_email, 
        c.type as card_type,
        c.name as card_name,
        c.birth_date as card_birth_date,
        c.qr_code_token as card_qr_code_token,
        c.cvv as card_cvv
      FROM physical_card_requests r
      JOIN users u ON r.user_id = u.id
      JOIN cards c ON r.card_id = c.id
      ORDER BY r.created_at DESC
    `;

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Erro ao buscar solicitações de cartões:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
