import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyJWT } from '@/lib/auth-utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Não autenticado' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    const results = await sql`
      SELECT id, full_name, email, cpf, is_admin
      FROM users
      WHERE id = ${payload.userId}
    `;

    if (results.length === 0) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    const user = results[0];

    return NextResponse.json(
      {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          cpf: user.cpf,
          isAdmin: user.is_admin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
