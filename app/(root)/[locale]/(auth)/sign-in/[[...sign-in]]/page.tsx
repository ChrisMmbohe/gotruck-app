
"use client";
import { SignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as React from "react";

export default function SignInPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const t = useTranslations("Auth");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-sm normal-case shadow-lg hover:shadow-xl transition-all",
            card: "shadow-none w-full",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            logoBox: "hidden",
            logoImage: "hidden",
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
        path={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
        afterSignInUrl={`/${locale}/dashboard`}
        afterSignUpUrl={`/${locale}/onboarding`}
      />

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")} {" "}
          <Link
            href={`/${locale}/sign-up`}
            className="font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent hover:from-slate-800 hover:to-black inline-flex items-center group"
          >
            {t("signUpLink")}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-700" />
          </Link>
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          {t("trustMessage")}
        </p>
      </div>
    </div>
  );
}
