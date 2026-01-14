'use client';

import { useUser, useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { UserRole } from '@/lib/auth/roles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Onboarding Page
 * Collects additional user information and sets up account
 */
export default function OnboardingPage() {
  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Setting up...');

  const roles = [
    {
      value: UserRole.SHIPPER,
      label: 'Shipper / Logistics Company',
      description: 'Manage shipments, track deliveries, and coordinate logistics',
      icon: '📦',
    },
    {
      value: UserRole.DRIVER,
      label: 'Driver',
      description: 'Receive assignments, update delivery status, and track routes',
      icon: '🚛',
    },
    {
      value: UserRole.ADMIN,
      label: 'Administrator',
      description: 'Full platform access with advanced management capabilities',
      icon: '⚙️',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    console.log('🎯 Role selected:', role);
    setSelectedRole(role);
  };

  const handleComplete = async () => {
    console.log('🚀 handleComplete called!');
    console.log('Selected Role:', selectedRole);
    console.log('User:', user?.id);
    
    if (!selectedRole || !user) {
      console.error('❌ Missing required data:', { selectedRole, userId: user?.id });
      return;
    }

    console.log('✅ Starting onboarding process...');
    setIsLoading(true);

    try {
      console.log('📡 Calling API /api/onboarding...');
      // Call API to update user metadata
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      console.log('📥 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to update onboarding status');
      }

      console.log('✅ Onboarding API completed successfully');

      // Poll for metadata update (Clerk JWT needs time to propagate)
      let attempts = 0;
      const maxAttempts = 10;
      
      setLoadingMessage('Syncing your account...');
      
      while (attempts < maxAttempts) {
        await user.reload();
        console.log(`Poll attempt ${attempts + 1}: Checking metadata...`);
        setLoadingMessage(`Verifying setup (${attempts + 1}/${maxAttempts})...`);
        
        const publicMetadata = user.publicMetadata as {
          role?: string;
          onboardingComplete?: boolean;
        };

        console.log('Current metadata:', publicMetadata);

        if (publicMetadata?.onboardingComplete === true) {
          console.log('✓ Onboarding metadata confirmed!');
          setLoadingMessage('Success! Refreshing session...');
          
          // Force session token refresh to update JWT claims
          if (session) {
            console.log('🔄 Reloading session token...');
            await session.reload();
            console.log('✅ Session token reloaded');
            
            // Wait longer for JWT cookie to update
            console.log('⏳ Waiting for JWT cookie to update...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('✅ Wait complete');
          }
          
          break;
        }

        console.log('Metadata not updated yet, waiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (attempts >= maxAttempts) {
        console.warn('Metadata polling timed out, proceeding anyway...');
        setLoadingMessage('Completing setup...');
      }

      // Redirect based on role with a flag to bypass middleware check
      const redirectPaths: Record<UserRole, string> = {
        [UserRole.DRIVER]: `/${locale}/dashboard/tracking?onboarding=complete`,
        [UserRole.SHIPPER]: `/${locale}/dashboard?onboarding=complete`,
        [UserRole.ADMIN]: `/${locale}/dashboard/analytics?onboarding=complete`,
      };

      console.log('🚀 Redirecting to:', redirectPaths[selectedRole]);
      window.location.href = redirectPaths[selectedRole];
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-4xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to GoTruck! 🎉</h1>
          <p className="text-muted-foreground">
            Let's set up your account. What describes you best?
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleSelect(role.value)}
              className={`
                relative p-6 rounded-lg border-2 transition-all text-left
                ${
                  selectedRole === role.value
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }
              `}
            >
              {selectedRole === role.value && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="text-4xl mb-3">{role.icon}</div>
              <h3 className="font-semibold mb-2">{role.label}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </button>
          ))}
        </div>

        {/* Complete Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!selectedRole || isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground mb-4">
            What you'll get with GoTruck:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Real-time GPS Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Route Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Multi-currency Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
