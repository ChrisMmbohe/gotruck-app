"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialProviders } from "@/components/auth/SocialProviders";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const locale = useLocale();
  
  const handleSubmit = (formData: FormData) => {
    console.log("Sign up data:", Object.fromEntries(formData));
    // TODO: Implement actual sign-up logic with Clerk
  };

  const benefits = [
    "Real-time GPS tracking",
    "Automated route optimization",
    "Multi-currency support (KES, UGX, TZS)",
    "24/7 customer support",
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-muted-foreground">
          Start managing your freight logistics in minutes
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-6 p-4 bg-accent/50 rounded-lg border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Sign Up */}
      <div className="mb-6">
        <SocialProviders mode="signup" />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or sign up with email
          </span>
        </div>
      </div>

      {/* Email Sign Up Form */}
      <AuthForm mode="signup" onSubmit={handleSubmit} />

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/${locale}/sign-in`}
            className="font-semibold text-primary hover:underline inline-flex items-center group"
          >
            Sign in
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>

      {/* Trust & Security */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>SOC 2 Certified</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
