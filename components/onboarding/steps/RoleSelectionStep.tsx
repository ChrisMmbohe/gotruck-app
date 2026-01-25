/**
 * Role Selection Step
 * First step in onboarding - allows users to choose their role
 * Inspired by Uber (Driver/Rider), DoorDash (Dasher/Customer), Upwork (Freelancer/Client)
 */

"use client";

import { useState } from "react";
import { Truck, Package, Shield, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/auth/roles";

interface RoleSelectionStepProps {
  data: {
    role?: UserRole;
  };
  onChange: (data: { role: UserRole }) => void;
  onNext: () => void;
}

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  gradient: string;
  ctaText: string;
}

export function RoleSelectionStep({ data, onChange, onNext }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(data.role || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions: RoleOption[] = [
    {
      id: UserRole.SHIPPER,
      title: "I need to ship goods",
      description: "Book trucks, track shipments, and manage deliveries across EAC",
      icon: <Package className="h-12 w-12" />,
      features: [
        "Create and manage shipments",
        "Real-time GPS tracking",
        "Multiple payment options",
        "Analytics and reports",
        "24/7 customer support"
      ],
      gradient: "from-blue-500 to-cyan-500",
      ctaText: "Ship as Shipper"
    },
    {
      id: UserRole.DRIVER,
      title: "I want to drive and deliver",
      description: "Accept delivery jobs, earn money, and grow your business",
      icon: <Truck className="h-12 w-12" />,
      features: [
        "Flexible work schedule",
        "Competitive earnings",
        "Turn-by-turn navigation",
        "Instant payment processing",
        "Driver rewards program"
      ],
      gradient: "from-green-500 to-emerald-500",
      ctaText: "Drive with GoTruck"
    },
    {
      id: UserRole.ADMIN,
      title: "I manage operations",
      description: "Oversee platform operations, users, and analytics",
      icon: <Shield className="h-12 w-12" />,
      features: [
        "User management",
        "Platform analytics",
        "Dispute resolution",
        "System configuration",
        "Advanced reporting"
      ],
      gradient: "from-purple-500 to-pink-500",
      ctaText: "Admin Dashboard"
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    
    try {
      // Update role in Clerk metadata immediately
      const response = await fetch('/api/onboarding/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to save role');
      }

      // Update local state
      onChange({ role: selectedRole });
      
      // Proceed to next step
      onNext();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role selection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to GoTruck! 🚛
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose how you want to use our platform. You can always change this later in settings.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {roleOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleRoleSelect(option.id)}
            className={`
              relative rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
              hover:shadow-xl hover:scale-105
              ${selectedRole === option.id 
                ? 'border-primary shadow-lg ring-4 ring-primary/20' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5`} />
            
            {/* Selected Badge */}
            {selectedRole === option.id && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-2">
                <Check className="h-5 w-5" />
              </div>
            )}

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Icon */}
              <div className={`
                inline-flex p-4 rounded-xl bg-gradient-to-br ${option.gradient} 
                text-white shadow-lg
              `}>
                {option.icon}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{option.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 pt-2">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={selectedRole === option.id ? "default" : "outline"}
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect(option.id);
                }}
              >
                {selectedRole === option.id ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Selected
                  </>
                ) : (
                  option.ctaText
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedRole || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Not sure which role to choose?{" "}
          <a 
            href="/help/roles" 
            target="_blank"
            className="text-primary hover:underline font-medium"
          >
            Learn more about each role
          </a>
        </p>
      </div>
    </div>
  );
}
