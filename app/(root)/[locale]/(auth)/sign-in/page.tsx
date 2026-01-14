"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { AuthForm } from "@/components/auth/AuthForm";
import { SocialProviders } from "@/components/auth/SocialProviders";
import { ArrowRight } from "lucide-react";

export default function SignInPage() {
  const locale = useLocale();
  
  const handleSubmit = (formData: FormData) => {
    console.log("Sign in data:", Object.fromEntries(formData));
    // TODO: Implement actual sign-in logic with Clerk
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Sign In */}
      <div className="mb-6">
        <SocialProviders mode="signin" />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email Sign In Form */}
      <AuthForm mode="signin" onSubmit={handleSubmit} />

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href={`/${locale}/sign-up`}
            className="font-semibold text-primary hover:underline inline-flex items-center group"
          >
            Sign up for free
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Trusted by 5,000+ logistics companies across East Africa
        </p>
      </div>
    </div>
  );
}
