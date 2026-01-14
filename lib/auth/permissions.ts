import { UserRole, Permission, PERMISSIONS, UserMetadata } from './roles';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Permission checking utilities for role-based access control
 */

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user has all specified permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get user role from Clerk metadata
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  const publicMetadata = user.publicMetadata as { role?: UserRole };
  return publicMetadata.role || null;
}

/**
 * Get full user metadata
 */
export async function getUserMetadata(): Promise<UserMetadata | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  const metadata = user.publicMetadata as Partial<UserMetadata>;
  
  return {
    role: metadata.role || UserRole.SHIPPER,
    companyId: metadata.companyId,
    companyName: metadata.companyName,
    phoneNumber: metadata.phoneNumber,
    country: metadata.country,
    licenseNumber: metadata.licenseNumber,
    vehicleId: metadata.vehicleId,
    isVerified: metadata.isVerified || false,
    onboardingComplete: metadata.onboardingComplete || false,
    createdAt: metadata.createdAt || new Date(),
  };
}

/**
 * Check if the current user has a specific permission
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  const role = await getUserRole();
  
  if (!role) {
    return false;
  }
  
  return hasPermission(role, permission);
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  return userId;
}

/**
 * Require specific role - redirects if user doesn't have the role
 */
export async function requireRole(allowedRoles: UserRole | UserRole[], redirectTo = '/dashboard') {
  const userId = await requireAuth();
  const role = await getUserRole();
  
  if (!role) {
    redirect('/sign-in');
  }
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!roles.includes(role)) {
    redirect(redirectTo);
  }
  
  return { userId, role };
}

/**
 * Require specific permission - redirects if user doesn't have permission
 */
export async function requirePermission(permission: Permission, redirectTo = '/dashboard') {
  const userId = await requireAuth();
  const hasPermissionResult = await checkPermission(permission);
  
  if (!hasPermissionResult) {
    redirect(redirectTo);
  }
  
  return userId;
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const metadata = await getUserMetadata();
  return metadata?.onboardingComplete || false;
}

/**
 * Require onboarding completion - redirects to onboarding if not complete
 */
export async function requireOnboarding() {
  const userId = await requireAuth();
  const completed = await hasCompletedOnboarding();
  
  if (!completed) {
    redirect('/onboarding');
  }
  
  return userId;
}

/**
 * Get role-specific dashboard path
 */
export function getRoleDashboardPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    [UserRole.DRIVER]: '/dashboard/tracking',
    [UserRole.SHIPPER]: '/dashboard',
    [UserRole.ADMIN]: '/dashboard/analytics',
  };
  
  return paths[role] || '/dashboard';
}

/**
 * Check if route is accessible by role
 */
export function isRouteAccessible(role: UserRole, path: string): boolean {
  // Public routes are always accessible
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/about', '/contact', '/pricing'];
  if (publicRoutes.some(route => path.startsWith(route))) {
    return true;
  }
  
  // Check role-specific routes
  if (role === UserRole.ADMIN) {
    return true; // Admins can access everything
  }
  
  if (role === UserRole.SHIPPER) {
    const shipperRestricted = ['/dashboard/users', '/dashboard/compliance'];
    return !shipperRestricted.some(route => path.startsWith(route));
  }
  
  if (role === UserRole.DRIVER) {
    const driverAllowed = [
      '/dashboard/tracking',
      '/dashboard/shipments',
      '/dashboard/settings',
    ];
    return driverAllowed.some(route => path.startsWith(route));
  }
  
  return false;
}
