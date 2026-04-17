import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSessionUserFromRequest, isAdminRole } from '@/lib/auth';
import { updateUserPasswordById } from '@/lib/admin-users';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = getSessionUserFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: 'Non authentifie.' }, { status: 401 });
  }

  if (!isAdminRole(session.role)) {
    return NextResponse.json({ message: 'Acces refuse.' }, { status: 403 });
  }

  const userId = Number(context.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ message: 'Identifiant utilisateur invalide.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const newPassword = String(body?.newPassword ?? '');

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Le nouveau mot de passe doit contenir au moins 8 caracteres.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await updateUserPasswordById(userId, passwordHash);

    if (!updated) {
      return NextResponse.json({ message: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Mot de passe reinitialise avec succes.' });
  } catch (error) {
    console.error('POST /api/admin/users/:id/reset-password error', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}
