import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyJWT } from "@/lib/auth-utils";
import { validateEmail, validateMinAge } from "@/lib/utils/validators";

function generateRandomPassword(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nome, email, birthDate } = data;

    if (!nome) {
      return NextResponse.json({ message: "Nome e obrigatorio" }, { status: 400 });
    }

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return NextResponse.json({ message: "E-mail valido e obrigatorio" }, { status: 400 });
    }

    if (!birthDate || !validateMinAge(birthDate)) {
      return NextResponse.json({ message: "Voce deve ter pelo menos 18 anos" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token")?.value;
    let sessionPayload = null;
    try {
      sessionPayload = tokenCookie ? await verifyJWT(tokenCookie) : null;
    } catch (e) {
      // Ignore invalid token.
    }

    let isUpgrade = false;
    let generatedPassword = null;

    if (sessionPayload && sessionPayload.userId) {
      isUpgrade = true;
      const existingEmail = await sql`
        SELECT id FROM users
        WHERE email = ${normalizedEmail} AND id != ${sessionPayload.userId}
      `;
      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail ja esta em uso" }, { status: 409 });
      }
    } else {
      const existingEmail = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`;
      if (existingEmail.length > 0) {
        return NextResponse.json({ message: "Este e-mail ja esta em uso" }, { status: 409 });
      }
      generatedPassword = generateRandomPassword(6);
    }

    return NextResponse.json(
      {
        message: "Dados validados. Prossiga para o pagamento.",
        password: generatedPassword,
        login: normalizedEmail,
        isUpgrade,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating premium user:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}
