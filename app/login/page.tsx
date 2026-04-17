import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import {
  getRedirectPathForRole,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from '@/lib/session';

export default function LoginPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;

  if (session) {
    redirect(getRedirectPathForRole(session.role));
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-48 -right-16 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <section className="hidden lg:block">
            <div className="max-w-lg space-y-6">
              <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Livraison intelligente
              </span>

              <h1 className="text-4xl font-bold leading-tight text-gray-900">
                Connectez votre equipe a une logistique claire et rapide.
              </h1>

              <p className="text-base leading-relaxed text-gray-600">
                Suivi temps reel des colis, gestion des factures et reclamations, tout dans une interface moderne adaptee a vos operations.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-gray-500">Taux livraison</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">97.4%</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-gray-500">Reclamations ouvertes</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <LoginForm />
          </section>
        </div>
      </div>
    </div>
  );
}
