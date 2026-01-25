"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

/**
 * Hero Section - Inspired by Samsara's bold value proposition and Motive's AI focus
 * Features EAC-themed visuals with gradient overlays and compelling CTAs
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with slate-themed gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('/images/hero-trucks7.jpg')] bg-cover bg-center opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Animated background elements - subtle patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Badge - Regional focus */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
          {t("badge")}
        </div>

        {/* Main Headline - Bold and clear like Uber Freight */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
          {t("title")}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-gray-400 mt-2">
            {t("titleHighlight")}
          </span>
        </h1>

        {/* Subtitle - Inspired by Flexport's clarity */}
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          {t("subtitle")}
        </p>

        {/* Key Benefits - Stats preview inspired by Geotab */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 bg-slate-400 rounded-full" />
            <span className="text-lg font-medium">{t("benefit1")}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-lg font-medium">{t("benefit2")}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 bg-slate-400 rounded-full" />
            <span className="text-lg font-medium">{t("benefit3")}</span>
          </div>
        </div>

        {/* CTAs - Dual action pattern from Motive */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
          <Link href="/sign-up">
            <Button 
              size="lg" 
              className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:scale-105 transition-all group"
            >
              {t("ctaPrimary")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full group"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            {t("ctaSecondary")}
          </Button>
        </div>

        {/* Trust Indicator - Inspired by CargoWise */}
        <p className="text-gray-300 text-sm mt-8 animate-fade-in-up delay-500">
          {t("trustIndicator")}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
