"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/50 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-2xl font-bold text-primary">G</span>
            </div>
            <span className="text-2xl font-bold">GoTruck</span>
          </Link>

          <div className="space-y-6 animate-fade-in-up delay-300">
            <h1 className="text-4xl font-bold leading-tight">
              Seamless Freight Logistics Across East Africa
            </h1>
            <p className="text-lg text-white/90 max-w-md">
              Join thousands of businesses managing their freight operations with real-time tracking, 
              automated routing, and comprehensive analytics.
            </p>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-sm text-white/80">Active Trucks</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/80">Shipments</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/80">On-Time Rate</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/70">
            © 2026 GoTruck. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href={`/${locale}`} className="flex items-center space-x-2 justify-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">G</span>
              </div>
              <span className="text-2xl font-bold">GoTruck</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
