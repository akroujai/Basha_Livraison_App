import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import { ADMIN_ROLES, hasRequiredRole } from '@/lib/auth';
import { listUsersForAdmin } from '@/lib/admin-users';
import {
  getRedirectPathForRole,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/session';

export default async function AdminUsersPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  if (!hasRequiredRole(session.role, ADMIN_ROLES)) {
    redirect(getRedirectPathForRole(session.role));
  }

  const users = await listUsersForAdmin();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administration des utilisateurs</h1>
              <p className="text-sm text-gray-600">Connecte en tant que: {session.fullName}</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <AdminUsersManager users={users} />
      </div>
    </main>
  );
}
