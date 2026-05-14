import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const accessories = [
      { id: 'lenco-signature', name: 'Lenço MeetOff Signature', price: 199.00, type: 'Acessório', category: 'Premium' },
      { id: 'lenco-premium', name: 'Lenço MeetOff Premium', price: 199.00, type: 'Acessório', category: 'Premium' },
      { id: 'lenco-classic', name: 'Lenço MeetOff Classic', price: 199.00, type: 'Acessório', category: 'Premium' },
      { id: 'gravata-signature', name: 'Gravata MeetOff Signature', price: 249.00, type: 'Acessório', category: 'Premium' },
      { id: 'gravata-premium', name: 'Gravata MeetOff Premium', price: 249.00, type: 'Acessório', category: 'Premium' },
      { id: 'gravata-classic', name: 'Gravata MeetOff Classic', price: 249.00, type: 'Acessório', category: 'Premium' },
    ];

    for (const acc of accessories) {
      // Check if exists by name (since we can't force UUID to be these slugs)
      const existing = await sql`SELECT id FROM products WHERE name = ${acc.name}`;
      
      if (existing.length === 0) {
        await sql`
          INSERT INTO products (name, price, type, category, stock, status)
          VALUES (${acc.name}, ${acc.price}, ${acc.type}, ${acc.category}, 999, 'Ativo')
        `;
      }
    }

    return NextResponse.json({ message: "Produtos premium sincronizados com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao sincronizar produtos" }, { status: 500 });
  }
}
