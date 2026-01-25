/**
 * Onboarding Wizard Component
 * Multi-step onboarding flow for different user types
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { UserRole, DEFAULT_REDIRECTS } from "@/lib/auth/roles";
import {
  RoleSelectionStep,
  WelcomeStep,
  ProfileInfoStep,
  CompanyInfoStep,
  DriverInfoStep,
  DocumentsStep,
  PreferencesStep,
  CompleteStep
} from "./steps";

interface OnboardingData {
  // Role
  role?: UserRole;
  
  // Profile
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  
  // Company (Shipper)
  companyName?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  
  // Driver
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // Documents
  documents?: Array<{
    type: string;
    file: File;
  }>;
  
  // Preferences
  language?: string;
  currency?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export function OnboardingWizard() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({});

  // Get selected role from formData or fallback to user metadata
  const selectedRole = formData.role || (user?.publicMetadata?.role as UserRole);

  // Define steps based on role
  const getSteps = () => {
    // Always start with role selection if no role is set
    if (!selectedRole) {
      return [
        { id: 'role', title: 'Choose Role', component: RoleSelectionStep },
      ];
    }

    const baseSteps = [
      { id: 'role', title: 'Choose Role', component: RoleSelectionStep },
      { id: 'welcome', title: 'Welcome', component: WelcomeStep },
      { id: 'profile', title: 'Profile Info', component: ProfileInfoStep },
    ];

    if (selectedRole === UserRole.SHIPPER) {
      return [
        ...baseSteps,
        { id: 'company', title: 'Company Info', component: CompanyInfoStep },
        { id: 'documents', title: 'Documents', component: DocumentsStep },
        { id: 'preferences', title: 'Preferences', component: PreferencesStep },
        { id: 'complete', title: 'Complete', component: CompleteStep },
      ];
    } else if (selectedRole === UserRole.DRIVER) {
      return [
        ...baseSteps,
        { id: 'driver', title: 'Driver Info', component: DriverInfoStep },
        { id: 'documents', title: 'Documents', component: DocumentsStep },
        { id: 'preferences', title: 'Preferences', component: PreferencesStep },
        { id: 'complete', title: 'Complete', component: CompleteStep },
      ];
    } else {
      return [
        ...baseSteps,
        { id: 'preferences', title: 'Preferences', component: PreferencesStep },
        { id: 'complete', title: 'Complete', component: CompleteStep },
      ];
    }
  };

  const steps = getSteps();
  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      console.log('📤 Submitting onboarding data:', formData);
      
      // Submit all data to API
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const result = await response.json();
      console.log('✅ Onboarding completed successfully:', result);

      // Force reload the user session to get updated metadata
      console.log('🔄 Reloading user session...');
      await user?.reload();
      
      // Wait for Clerk to sync metadata (increased timeout)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify onboarding status was updated
      const updatedMetadata = user?.publicMetadata as { onboardingComplete?: boolean };
      console.log('📊 Updated metadata:', updatedMetadata);

      // Redirect to role-specific portal
      const userRole = formData.role || (user?.publicMetadata?.role as UserRole) || UserRole.SHIPPER;
      const redirectPath = DEFAULT_REDIRECTS[userRole] || '/dashboard';
      console.log('🔀 Redirecting to:', redirectPath, 'for role:', userRole);
      
      // Use window.location.href for a full page reload to ensure middleware picks up new metadata
      // Add timestamp to force fresh middleware check
      window.location.href = `${redirectPath}?onboarding=complete&t=${Date.now()}`;
    } catch (error) {
      console.error('❌ Onboarding error:', error);
      alert(`Failed to complete onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <p className="text-xs mt-2 text-center hidden sm:block">
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="pt-6">
            <CurrentStepComponent
              data={formData}
              onChange={handleStepChange}
              onNext={handleNext}
              onComplete={handleComplete}
            />
          </CardContent>

          {/* Navigation */}
          {!isLastStep && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
