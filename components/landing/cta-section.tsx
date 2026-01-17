"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

/**
 * CTA Section - Inspired by Motive's demo booking and Flexport's trial signup
 * Final conversion-focused section before footer
 */
export function CTASection() {
  const t = useTranslations("home.cta");

  const benefits = [
    t("benefit1"),
    t("benefit2"),
    t("benefit3"),
    t("benefit4"),
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("title")}
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-slate-100 mb-10 leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <CheckCircle className="h-6 w-6 text-slate-400 flex-shrink-0" />
                <span className="text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-6 text-lg font-semibold rounded-full shadow-2xl hover:scale-105 transition-all group"
              >
                {t("ctaPrimary")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full"
              >
                {t("ctaSecondary")}
              </Button>
            </Link>
          </div>

          {/* Trust Message */}
          <p className="text-slate-200 text-sm mt-8">
            {t("trustMessage")}
          </p>
        </div>
      </div>
    </section>
  );
}
