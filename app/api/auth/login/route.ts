import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { comparePassword, signJWT } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const { emailOrCpf, password, rememberMe } = await request.json();

    if (!emailOrCpf || !password) {
      return NextResponse.json(
        { message: 'E-mail/CPF e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const results = await sql`
      SELECT id, full_name, email, cpf, password_hash, is_admin
      FROM users
      WHERE email = ${emailOrCpf} OR cpf = ${emailOrCpf}
    `;

    if (results.length === 0) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const user = results[0];
    const isPasswordCorrect = await comparePassword(password, user.password_hash);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
    });

    const response = NextResponse.json(
      {
        message: 'Login realizado com sucesso',
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

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 4; // 4 hours
    }

    response.cookies.set('auth_token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
