import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth-utils";
import { createGreenCard } from "@/lib/card-utils";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const session = await getUserSession();
  
  if (!session) {
    return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
  }

  const { email, password, birthDate: providedBirthDate } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios para confirmar sua identidade" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  
  // Verify user and get their name
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = users[0];

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  // Check if user already has an active card
  const existingCards = await sql`
    SELECT * FROM cards WHERE owner_id = ${session.userId} AND status = 'ATIVO'
  `;

  if (existingCards.length > 0) {
    return NextResponse.json({ error: "Você já possui um cartão ativo" }, { status: 400 });
  }

  // Determine birth date to use (prioritize the one provided in the request)
  let finalBirthDate = providedBirthDate || user.birth_date;

  if (!finalBirthDate) {
    return NextResponse.json({ error: "Data de nascimento é necessária para gerar o cartão" }, { status: 400 });
  }

  // Robust Age Validation (Independent of Timezone)
  let bYear, bMonth, bDay;

  if (typeof finalBirthDate === 'string') {
    // Handle YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
    const parts = finalBirthDate.split(/[-/]/).map(Number);
    if (parts[0] > 1000) {
      // Format: YYYY, MM, DD
      [bYear, bMonth, bDay] = parts;
    } else {
      // Format: DD, MM, YYYY
      [bDay, bMonth, bYear] = parts;
    }
  } else {
    // It's a Date object
    const d = new Date(finalBirthDate);
    bYear = d.getUTCFullYear();
    bMonth = d.getUTCMonth() + 1;
    bDay = d.getUTCDate();
  }
  
  if (!bYear || !bMonth || !bDay || isNaN(bYear)) {
    return NextResponse.json({ error: "Formato de data de nascimento inválido" }, { status: 400 });
  }

  const today = new Date();
  const tYear = today.getFullYear();
  const tMonth = today.getMonth() + 1; 
  const tDay = today.getDate();

  let age = tYear - bYear;
  if (tMonth < bMonth || (tMonth === bMonth && tDay < bDay)) {
    age--;
  }

  if (age < 18) {
    return NextResponse.json({ error: "Você precisa ter pelo menos 18 anos para solicitar o cartão MeetOff" }, { status: 400 });
  }

  // Update user's birth_date if it was provided now
  if (providedBirthDate && !user.birth_date) {
    await sql`UPDATE users SET birth_date = ${providedBirthDate} WHERE id = ${user.id}`;
  }

  try {
    // Use user.full_name and finalBirthDate
    const card = await createGreenCard(session.userId, user.full_name, finalBirthDate);
    return NextResponse.json({ success: true, card });
  } catch (error) {
    console.error("Erro ao solicitar cartão:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
