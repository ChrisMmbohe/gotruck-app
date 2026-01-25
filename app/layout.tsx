import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from "@/components/pwa-installer";
import { clerkAppearance } from "@/lib/auth/clerk-config";
import { PreferencesProvider } from "@/components/providers/preferences-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoTruck - EAC Freight Logistics Platform",
  description: "Comprehensive freight logistics management for East African Community",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GoTruck",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Clerk keys are configured
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PWAInstaller />
        {hasClerkKeys ? (
          <ClerkProvider
            appearance={clerkAppearance}
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <QueryProvider>
              <CurrencyProvider>
                <PreferencesProvider>
                  {children}
                  <Toaster />
                </PreferencesProvider>
              </CurrencyProvider>
            </QueryProvider>
          </ClerkProvider>
        ) : (
          <QueryProvider>
            <CurrencyProvider>
              <PreferencesProvider>
                {children}
                <Toaster />
              </PreferencesProvider>
            </CurrencyProvider>
          </QueryProvider>
        )}
      </body>
    </html>
  );
}
