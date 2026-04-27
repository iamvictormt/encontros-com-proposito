import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { createGreenCard } from "@/lib/card-utils";
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
  }

  const { name, birthDate } = await request.json();

  if (!name || !birthDate) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  
  // Check if user already has an active card
  const existingCards = await sql`
    SELECT * FROM cards WHERE owner_id = ${session.userId} AND status = 'ATIVO'
  `;

  if (existingCards.length > 0) {
    return NextResponse.json({ error: "Você já possui um cartão ativo" }, { status: 400 });
  }

  try {
    const card = await createGreenCard(session.userId, name, birthDate);
    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error("Erro ao solicitar cartão:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
