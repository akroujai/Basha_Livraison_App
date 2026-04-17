import { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/session';

export const ADMIN_ROLES = ['admin_principal', 'admin_secondaire'] as const;
export const AGENCY_ROLES = ['agence_ecommerce', 'client'] as const;
export const SUPPORT_ROLES = ['support_client'] as const;
export const DRIVER_ROLES = ['livreur'] as const;

export function getSessionUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function hasRequiredRole(role: string, allowedRoles: readonly string[]): boolean {
  return allowedRoles.includes(role);
}
