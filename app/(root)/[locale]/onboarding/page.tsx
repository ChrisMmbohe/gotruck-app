'use client';

import { useUser, useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { UserRole } from '@/lib/auth/roles';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, Building2, Phone, MapPin, Truck } from 'lucide-react';

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
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Setting up...');
  
  // Additional profile fields
  const [profileData, setProfileData] = useState({
    companyName: '',
    phoneNumber: '',
    country: 'KE' as 'KE' | 'UG' | 'TZ' | 'RW' | 'BI' | 'SS',
    licenseNumber: '', // For drivers
    vehicleId: '', // For drivers
  });

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
    setStep('details'); // Move to details collection step
  };

  const handleComplete = async () => {
    console.log('🚀 handleComplete called!');
    console.log('Selected Role:', selectedRole);
    console.log('Profile Data:', profileData);
    console.log('User:', user?.id);
    
    if (!selectedRole || !user) {
      console.error('❌ Missing required data:', { selectedRole, userId: user?.id });
      return;
    }

    // Validate required fields based on role
    if (!profileData.companyName || !profileData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedRole === UserRole.DRIVER && !profileData.licenseNumber) {
      alert('Driver license number is required');
      return;
    }

    console.log('✅ Starting onboarding process...');
    setIsLoading(true);

    try {
      console.log('📡 Calling API /api/onboarding...');
      // Call API to update user metadata with complete profile
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          role: selectedRole,
          ...profileData,
        }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <Card className="w-full max-w-4xl p-8 relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            {step === 'role' ? 'Welcome to GoTruck! 🎉' : 'Complete Your Profile'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'role' 
              ? "Let's set up your account. What describes you best?"
              : 'Provide additional details to complete your account setup'
            }
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-16 rounded-full transition-colors ${step === 'role' ? 'bg-gradient-to-r from-slate-700 to-slate-900' : 'bg-gradient-to-r from-slate-700 to-slate-900'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${step === 'details' ? 'bg-gradient-to-r from-slate-700 to-slate-900' : 'bg-gray-300'}`} />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 'role' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`
                  relative p-6 rounded-lg border-2 transition-all text-left hover:scale-105
                  ${
                    selectedRole === role.value
                      ? 'border-slate-700 bg-gradient-to-br from-slate-50 to-gray-50 shadow-lg'
                      : 'border-border hover:border-slate-500/50 hover:shadow-md hover:bg-gradient-to-br hover:from-slate-50/50 hover:to-gray-50/50'
                  }
                `}
              >
                {selectedRole === role.value && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-6 w-6 text-slate-700" />
                  </div>
                )}
                <div className="text-4xl mb-3">{role.icon}</div>
                <h3 className="font-semibold mb-2">{role.label}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Profile Details */}
        {step === 'details' && selectedRole && (
          <div className="max-w-2xl mx-auto space-y-6 mb-8">
            {/* Company Name */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-slate-700" />
                {selectedRole === UserRole.DRIVER ? 'Company/Fleet Name' : 'Company Name'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                placeholder={selectedRole === UserRole.DRIVER ? 'Enter your fleet or company name' : 'Enter your company name'}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                Phone Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Country
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="country"
                required
                value={profileData.country}
                onChange={(e) => setProfileData({ ...profileData, country: e.target.value as any })}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              >
                <option value="KE">Kenya (KE)</option>
                <option value="UG">Uganda (UG)</option>
                <option value="TZ">Tanzania (TZ)</option>
                <option value="RW">Rwanda (RW)</option>
                <option value="BI">Burundi (BI)</option>
                <option value="SS">South Sudan (SS)</option>
              </select>
            </div>

            {/* Driver-specific fields */}
            {selectedRole === UserRole.DRIVER && (
              <>
                <div className="space-y-2">
                  <label htmlFor="licenseNumber" className="text-sm font-medium flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-primary" />
                    Driver License Number
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="licenseNumber"
                    type="text"
                    required
                    value={profileData.licenseNumber}
                    onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                    placeholder="Enter your driver license number"
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="vehicleId" className="text-sm font-medium flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-primary" />
                    Vehicle ID/Plate Number
                  </label>
                  <input
                    id="vehicleId"
                    type="text"
                    value={profileData.vehicleId}
                    onChange={(e) => setProfileData({ ...profileData, vehicleId: e.target.value })}
                    placeholder="Enter your vehicle plate number"
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}

            {/* Back and Complete Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('role')}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={isLoading}
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
          </div>
        )}

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
