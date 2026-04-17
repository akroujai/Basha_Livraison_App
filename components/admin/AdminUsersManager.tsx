'use client';

import { useMemo, useState } from 'react';

type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  status: string;
  role: string;
  createdAt: string | null;
};

type Props = {
  users: AdminUser[];
};

export default function AdminUsersManager({ users }: Props) {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const sortedUsers = useMemo(() => users, [users]);

  async function handleResetPassword(userId: number) {
    const newPassword = window.prompt('Nouveau mot de passe (min 8 caracteres):');

    if (!newPassword) {
      return;
    }

    setLoadingUserId(userId);
    setFeedback('');

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFeedback(data?.message ?? 'Echec de reinitialisation.');
        return;
      }

      setFeedback(`Utilisateur #${userId}: mot de passe reinitialise.`);
    } catch {
      setFeedback('Erreur reseau pendant la reinitialisation.');
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h2>
      <p className="mt-1 text-sm text-gray-600">Liste des comptes et reinitialisation de mot de passe.</p>

      {feedback && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {feedback}
        </p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Nom</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 text-gray-700">
                <td className="px-3 py-2">{user.id}</td>
                <td className="px-3 py-2">{user.fullName}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{user.status}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => handleResetPassword(user.id)}
                    disabled={loadingUserId === user.id}
                    className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {loadingUserId === user.id ? 'En cours...' : 'Reset password'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
