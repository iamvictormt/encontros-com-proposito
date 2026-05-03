import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      cardId, 
      fullName, 
      cep, 
      address, 
      number, 
      complement, 
      neighborhood, 
      city, 
      state 
    } = body;

    if (!cardId || !fullName || !cep || !address || !number || !neighborhood || !city || !state) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Check if card exists and belongs to user
    const cards = await sql`SELECT * FROM cards WHERE id = ${cardId} AND owner_id = ${session.userId}`;
    if (cards.length === 0) {
      return NextResponse.json({ error: "Cartão não encontrado ou não pertence a você" }, { status: 404 });
    }

    // Check if there is already a pending or paid request for this card
    const existingRequests = await sql`
      SELECT * FROM physical_card_requests 
      WHERE card_id = ${cardId} AND status IN ('PENDENTE', 'PAGO', 'EM_PRODUCAO', 'ENVIADO')
    `;
    if (existingRequests.length > 0) {
      return NextResponse.json({ error: "Você já possui uma solicitação em andamento para este cartão" }, { status: 400 });
    }

    // Create the request
    const result = await sql`
      INSERT INTO physical_card_requests (
        user_id, 
        card_id, 
        full_name, 
        cep, 
        address, 
        number, 
        complement, 
        neighborhood, 
        city, 
        state,
        status
      ) VALUES (
        ${session.userId}, 
        ${cardId}, 
        ${fullName}, 
        ${cep}, 
        ${address}, 
        ${number}, 
        ${complement || null}, 
        ${neighborhood}, 
        ${city}, 
        ${state},
        'PAGO' -- Automatically marking as PAGO for simulation as requested
      ) RETURNING *
    `;

    return NextResponse.json({ success: true, request: result[0] });
  } catch (error) {
    console.error("Erro ao solicitar cartão físico:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
