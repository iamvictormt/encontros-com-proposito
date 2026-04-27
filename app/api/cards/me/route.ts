import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const cards = await sql`
    SELECT * FROM cards 
    WHERE owner_id = ${session.userId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  if (cards.length === 0) {
    return NextResponse.json({ card: null });
  }

  return NextResponse.json({ card: cards[0] });
}
