'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, Permission, PERMISSIONS } from '@/lib/auth/roles';
import { ReactNode } from 'react';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  fallback?: ReactNode;
}

/**
 * Role Gate Component
 * Conditionally renders children based on user role or permission
 */
export function RoleGate({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}: RoleGateProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait for user data to load
  if (!isLoaded) {
    return null;
  }

  // Return fallback if not signed in
  if (!isSignedIn) {
    return <>{fallback}</>;
  }

  const userRole = user?.publicMetadata?.role as UserRole;

  // Check role-based access
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (requiredPermission && userRole) {
    const hasPermission = PERMISSIONS[requiredPermission]?.includes(userRole);
    
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
