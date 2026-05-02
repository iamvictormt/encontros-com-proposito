import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const token = (await cookies()).get("auth_token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ message: "Faça login para participar" }, { status: 401 });
  }

  try {
    const { eventId, selectedProducts = [] } = await request.json();

    // Check capacity
    const event = await sql`SELECT capacity FROM events WHERE id = ${eventId}`;
    const participations = await sql`SELECT COUNT(*) FROM participations WHERE event_id = ${eventId}`;
    
    if (event[0].capacity > 0 && parseInt(participations[0].count) >= event[0].capacity) {
      return NextResponse.json({ message: "Desculpe, este evento já atingiu o limite de vagas." }, { status: 400 });
    }

    // Ensure the optional_products column exists
    await sql`ALTER TABLE participations ADD COLUMN IF NOT EXISTS optional_products JSONB DEFAULT '[]'`;

    // Register participation
    await sql`
      INSERT INTO participations (user_id, event_id, optional_products)
      VALUES (${payload.userId}, ${eventId}, ${JSON.stringify(selectedProducts)})
      ON CONFLICT (user_id, event_id) DO UPDATE SET optional_products = EXCLUDED.optional_products
    `;

    return NextResponse.json({ message: "Inscrição salva com sucesso!" });
  } catch (error) {
    console.error("Participation error:", error);
    return NextResponse.json({ message: "Erro ao confirmar participação" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const userId = searchParams.get("userId");

  try {
    if (eventId && userId) {
      const check = await sql`SELECT * FROM participations WHERE event_id = ${eventId} AND user_id = ${userId}`;
      return NextResponse.json({ 
        isParticipating: check.length > 0,
        optionalProducts: check.length > 0 ? check[0].optional_products : []
      });
    }
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
