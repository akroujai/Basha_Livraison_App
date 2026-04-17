import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import { ADMIN_ROLES, hasRequiredRole } from '@/lib/auth';
import {
  getRedirectPathForRole,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/session';

export default function AdminDashboardPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  if (!hasRequiredRole(session.role, ADMIN_ROLES)) {
    redirect(getRedirectPathForRole(session.role));
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-600">Bienvenue, {session.fullName}</p>
          </div>
          <LogoutButton />
        </div>

        <p className="text-gray-700">Acces autorise pour: admin_principal, admin_secondaire.</p>
      </div>
    </main>
  );
}
