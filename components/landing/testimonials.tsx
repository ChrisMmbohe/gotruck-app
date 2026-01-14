"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

/**
 * Testimonials Section - Inspired by Flexport's case studies and Samsara's customer success stories
 * Features EAC-based logistics companies with real-world impact
 */
export function Testimonials() {
  const t = useTranslations("home.testimonials");

  const testimonials = [
    {
      quote: t("testimonial1.quote"),
      author: t("testimonial1.author"),
      role: t("testimonial1.role"),
      company: t("testimonial1.company"),
      country: t("testimonial1.country"),
      impact: t("testimonial1.impact"),
      image: "/images/testimonial-1.jpg",
    },
    {
      quote: t("testimonial2.quote"),
      author: t("testimonial2.author"),
      role: t("testimonial2.role"),
      company: t("testimonial2.company"),
      country: t("testimonial2.country"),
      impact: t("testimonial2.impact"),
      image: "/images/testimonial-2.jpg",
    },
    {
      quote: t("testimonial3.quote"),
      author: t("testimonial3.author"),
      role: t("testimonial3.role"),
      company: t("testimonial3.company"),
      country: t("testimonial3.country"),
      impact: t("testimonial3.impact"),
      image: "/images/testimonial-3.jpg",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed italic relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Impact Metric */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-semibold text-sm">
                  {testimonial.impact}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company} • {testimonial.country}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
