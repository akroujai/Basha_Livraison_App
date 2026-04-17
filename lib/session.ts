import jwt from 'jsonwebtoken';

export const SESSION_COOKIE_NAME = 'livraison_session';

export type SessionUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'dev_only_change_me_jwt_secret';
}

export function createSessionToken(user: SessionUser): string {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '12h' }
  );
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;

    const id = Number(decoded.sub);
    const email = String(decoded.email ?? '');
    const fullName = String(decoded.fullName ?? '');
    const role = String(decoded.role ?? '');

    if (!id || !email || !fullName || !role) {
      return null;
    }

    return { id, email, fullName, role };
  } catch {
    return null;
  }
}

export function getRedirectPathForRole(role: string): string {
  switch (role) {
    case 'agence_ecommerce':
    case 'client':
      return '/agency/dashboard';
    case 'livreur':
      return '/livreur/dashboard';
    case 'support_client':
      return '/support/dashboard';
    case 'admin_principal':
    case 'admin_secondaire':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}
