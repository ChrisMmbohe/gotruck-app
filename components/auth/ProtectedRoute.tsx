'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { UserRole } from '@/lib/auth/roles';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
  fallbackUrl?: string;
}

/**
 * Protected Route Component
 * Wraps content that requires authentication and/or specific roles
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  requireOnboarding = false,
  fallbackUrl = '/sign-in',
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait for user data to load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    redirect(fallbackUrl);
  }

  // Check role-based access
  if (allowedRoles && user) {
    const userRole = user.publicMetadata?.role as UserRole;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      redirect('/dashboard'); // Redirect to default dashboard
    }
  }

  // Check onboarding requirement
  if (requireOnboarding && user) {
    const onboardingComplete = user.publicMetadata?.onboardingComplete as boolean;
    
    if (!onboardingComplete) {
      redirect('/onboarding');
    }
  }

  return <>{children}</>;
}
