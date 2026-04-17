'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data?.message ?? 'Connexion impossible.');
        setLoading(false);
        return;
      }

      router.push(data?.redirectTo ?? '/admin/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Erreur reseau. Verifiez votre connexion et reessayez.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="border-gray-200 shadow-xl shadow-gray-200/60">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            Connexion securisee
          </div>

          <CardTitle className="text-2xl text-gray-900">Connexion</CardTitle>
          <CardDescription className="text-gray-600">

            Connectez- vous pour gerer vos livraisons, suivre vos colis et acceder a des outils de gestion puissants adaptes a vos besoins.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@livraison.com"
                  className="h-11 border-gray-200 pl-10 focus-visible:ring-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Votre mot de passe"
                  className="h-11 border-gray-200 pl-10 pr-10 focus-visible:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                Se souvenir de moi
              </label>
              <a href="#" className="font-medium text-amber-600 hover:text-amber-700">
                Mot de passe oublie ?
              </a>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-amber-500 text-gray-900 hover:bg-amber-600"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {errorMessage && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
          </form>

          <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
            <p className="font-semibold text-gray-700">Compte de demonstration</p>
            <p>Email: admin@livraison.com</p>
            <p>Mot de passe: Admin@123</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <Truck className="h-3.5 w-3.5" />
        Plateforme de Livraison - 2026 &copy; Tous droits reserves.
      </div>
    </div>
  );
}
