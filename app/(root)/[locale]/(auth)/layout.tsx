"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("auth.layout");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Hero Trucks Background Image */}
        <Image
          src="/images/hero-trucks7.jpg"
          alt="Trucks on the road"
          fill
          className="object-cover object-center absolute inset-0 z-0 opacity-20"
          priority
        />
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/50 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-20 flex flex-col justify-between p-12 text-white">
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <img
              src="/images/1-rmvbg2.png"
              alt="GoTruck Logo"
              className="w-24 h-20 object-contain rounded-md shadow-sm p-1 transition-transform group-hover:scale-110"
            />
          </Link>

          <div className="space-y-6 animate-fade-in-up delay-300">
            <h1 className="text-4xl font-bold leading-tight">
              {t("heading")}
            </h1>
            <p className="text-lg text-white/90 max-w-md">
              {t("description")}
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-sm text-white/80">{t("stats.trucks")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/80">{t("stats.shipments")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/80">{t("stats.onTimeRate")}</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/70">
            © 2026 GoTruck. {t("copyright")}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href={`/${locale}`} className="flex items-center space-x-2 justify-center">
              <img
                src="/images/2-rmvbg2.png"
                alt="GoTruck Logo"
                className="w-10 h-10 object-contain rounded-md shadow-sm"
              />
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
