"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Truck, Menu, X, Globe } from "lucide-react";

/**
 * Header/Navigation - Inspired by clean navigation from Uber Freight and Flexport
 * Features locale switcher and responsive mobile menu
 */
export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const navigation = [
    { name: t("solutions"), href: "/solutions" },
    { name: t("pricing"), href: "/pricing" },
    { name: t("resources"), href: "/resources" },
    { name: t("company"), href: "/company" },
  ];

  const locales = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const currentLocale = pathname?.split("/")[1] || "en";

  const switchLocale = (locale: string) => {
    const newPath = pathname?.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPath || `/${locale}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {t("appName")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={`/${currentLocale}${item.href}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Locale Switcher */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocaleMenuOpen(!localeMenuOpen)}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">
                  {locales.find((l) => l.code === currentLocale)?.flag}
                </span>
              </Button>

              {localeMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                  {locales.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => {
                        switchLocale(locale.code);
                        setLocaleMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                        currentLocale === locale.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}
                    >
                      <span className="text-xl">{locale.flag}</span>
                      <span className="text-sm font-medium">{locale.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href={`/${currentLocale}/sign-in`}>
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href={`/${currentLocale}/sign-up`}>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:opacity-90">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={`/${currentLocale}${item.href}`}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link href={`/${currentLocale}/sign-in`}>
                  <Button variant="ghost" size="sm" className="w-full">
                    {t("signIn")}
                  </Button>
                </Link>
                <Link href={`/${currentLocale}/sign-up`}>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                    {t("getStarted")}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
