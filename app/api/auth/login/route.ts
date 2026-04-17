import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDbPool } from '@/lib/db';
import {
  createSessionToken,
  getRedirectPathForRole,
  SESSION_COOKIE_NAME,
} from '@/lib/session';

type UserRow = {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  status: string;
  role: string;
};

async function findUserByEmail(email: string): Promise<UserRow | null> {
  const pool = getDbPool();

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, u.status, r.code AS role
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.email = ? AND u.deleted_at IS NULL
       LIMIT 1`,
      [email]
    );

    const typedRows = rows as UserRow[];
    return typedRows[0] ?? null;
  } catch {
    // Fallback schema: users.role as ENUM (without roles table relation)
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, u.status, u.role AS role
       FROM users u
       WHERE u.email = ? AND u.deleted_at IS NULL
       LIMIT 1`,
      [email]
    );

    const typedRows = rows as UserRow[];
    return typedRows[0] ?? null;
  }
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe sont obligatoires.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { message: 'Compte inactif ou suspendu.' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Identifiants invalides.' },
        { status: 401 }
      );
    }

    const redirectTo = getRedirectPathForRole(user.role);
    const sessionToken = createSessionToken({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Connexion reussie.',
      redirectTo,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/login error', error);
    return NextResponse.json(
      { message: 'Erreur serveur pendant la connexion.' },
      { status: 500 }
    );
  }
}
