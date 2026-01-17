"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const locale = useLocale();

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
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">Create your account</h1>
        <p className="text-muted-foreground">
          Start managing your freight logistics in minutes
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clerk Sign Up Component */}
      <div className="flex justify-center">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-sm normal-case shadow-lg hover:shadow-xl transition-all",
              card: "shadow-none w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border-gray-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 h-11 transition-all",
              formFieldLabel: "text-sm font-medium text-gray-700",
              formFieldInput:
                "rounded-lg border-gray-300 focus:border-slate-500 focus:ring-slate-500 h-11",
              footerActionLink: "text-slate-700 hover:text-slate-900 transition-colors",
              footer: "hidden",
            },
          }}
          routing="path"
          path={`/${locale}/sign-up`}
          signInUrl={`/${locale}/sign-in`}
          afterSignInUrl={`/${locale}/dashboard`}
          afterSignUpUrl={`/${locale}/onboarding`}
        />
      </div>

      {/* Legal Links */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link
          href={`/${locale}/terms`}
          className="text-primary hover:underline font-medium"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href={`/${locale}/privacy`}
          className="text-primary hover:underline font-medium"
        >
          Privacy Policy
        </Link>
      </div>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/${locale}/sign-in`}
            className="font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent hover:from-slate-800 hover:to-black inline-flex items-center group"
          >
            Sign in
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-700" />
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
