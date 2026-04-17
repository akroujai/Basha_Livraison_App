import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserFromRequest, isAdminRole } from '@/lib/auth';
import { listUsersForAdmin } from '@/lib/admin-users';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: 'Non authentifie.' }, { status: 401 });
  }

  if (!isAdminRole(session.role)) {
    return NextResponse.json({ message: 'Acces refuse.' }, { status: 403 });
  }

  try {
    const users = await listUsersForAdmin();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('GET /api/admin/users error', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}
