'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole, Permission, PERMISSIONS, UserMetadata } from '@/lib/auth/roles';

/**
 * Custom hook to access user permissions
 */
export function usePermissions() {
  const { isLoaded, isSignedIn, user } = useUser();

  const userRole = user?.publicMetadata?.role as UserRole | undefined;

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!isSignedIn || !userRole) return false;
    return PERMISSIONS[permission]?.includes(userRole) || false;
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };

  return {
    isLoaded,
    isSignedIn,
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
}

/**
 * Custom hook to access user metadata
 */
export function useUserMetadata() {
  const { isLoaded, isSignedIn, user } = useUser();

  const metadata: Partial<UserMetadata> | null = user
    ? {
        role: user.publicMetadata?.role as UserRole,
        companyId: user.publicMetadata?.companyId as string,
        companyName: user.publicMetadata?.companyName as string,
        phoneNumber: user.publicMetadata?.phoneNumber as string,
        country: user.publicMetadata?.country as any,
        licenseNumber: user.publicMetadata?.licenseNumber as string,
        vehicleId: user.publicMetadata?.vehicleId as string,
        isVerified: user.publicMetadata?.isVerified as boolean,
        onboardingComplete: user.publicMetadata?.onboardingComplete as boolean,
        createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
      }
    : null;

  return {
    isLoaded,
    isSignedIn,
    user,
    metadata,
  };
}

/**
 * Custom hook for onboarding status
 */
export function useOnboardingStatus() {
  const { isLoaded, isSignedIn, user } = useUser();

  const isOnboardingComplete =
    (user?.publicMetadata?.onboardingComplete as boolean) || false;

  return {
    isLoaded,
    isSignedIn,
    isOnboardingComplete,
    needsOnboarding: isSignedIn && !isOnboardingComplete,
  };
}
