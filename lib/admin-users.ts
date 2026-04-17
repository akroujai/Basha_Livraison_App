import { getDbPool } from '@/lib/db';

type AdminUserRow = {
  id: number;
  full_name: string;
  email: string;
  status: string;
  role: string;
  created_at?: string | null;
};

export type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  status: string;
  role: string;
  createdAt: string | null;
};

function normalizeRows(rows: AdminUserRow[]): AdminUser[] {
  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    status: row.status,
    role: row.role,
    createdAt: row.created_at ?? null,
  }));
}

export async function listUsersForAdmin(limit = 200): Promise<AdminUser[]> {
  const pool = getDbPool();

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.status, COALESCE(r.code, u.role) AS role, u.created_at
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.deleted_at IS NULL
       ORDER BY u.id DESC
       LIMIT ?`,
      [limit]
    );

    return normalizeRows(rows as AdminUserRow[]);
  } catch {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.status, u.role AS role, u.created_at
       FROM users u
       WHERE u.deleted_at IS NULL
       ORDER BY u.id DESC
       LIMIT ?`,
      [limit]
    );

    return normalizeRows(rows as AdminUserRow[]);
  }
}

export async function updateUserPasswordById(userId: number, passwordHash: string): Promise<boolean> {
  const pool = getDbPool();

  const [result] = await pool.query(
    `UPDATE users
     SET password_hash = ?
     WHERE id = ? AND deleted_at IS NULL`,
    [passwordHash, userId]
  );

  const typed = result as { affectedRows?: number };
  return (typed.affectedRows ?? 0) > 0;
}
