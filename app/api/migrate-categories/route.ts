import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Insert default categories if they don't exist
    const defaultCategories = [
      "Caneca",
      "Agenda",
      "Caderno",
      "Kit",
      "Planner",
      "Acessório",
      "Outros"
    ];

    for (const cat of defaultCategories) {
      await sql`
        INSERT INTO categories (name)
        VALUES (${cat})
        ON CONFLICT (name) DO NOTHING;
      `;
    }

    return NextResponse.json({ message: "Categories table created and seeded" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
