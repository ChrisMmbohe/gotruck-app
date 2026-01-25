'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { UserRole } from '@/lib/auth/roles';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

/**
 * Onboarding Page
 * Multi-step onboarding flow using OnboardingWizard component
 */
export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const locale = useLocale();
  
  // Check if user has already completed onboarding
  useEffect(() => {
    if (isLoaded && user) {
      const publicMetadata = user.publicMetadata as {
        role?: string;
        onboardingComplete?: boolean;
      };
      
      // If onboarding is already complete, redirect to dashboard
      if (publicMetadata?.onboardingComplete === true && publicMetadata?.role) {
        console.log('✅ User already completed onboarding, redirecting...');
        const redirectPaths: Record<string, string> = {
          [UserRole.DRIVER]: `/${locale}/dashboard/tracking`,
          [UserRole.SHIPPER]: `/${locale}/dashboard`,
          [UserRole.ADMIN]: `/${locale}/dashboard/analytics`,
        };
        const redirectPath = redirectPaths[publicMetadata.role] || `/${locale}/dashboard`;
        router.push(redirectPath);
      }
    }
  }, [isLoaded, user, router, locale]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the OnboardingWizard
  return <OnboardingWizard />;
}
