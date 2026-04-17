import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getRedirectPathForRole,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/session';

export default function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  redirect(getRedirectPathForRole(session.role));
}
