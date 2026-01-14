"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

/**
 * Resources Section - Inspired by Uber Freight's market insights and Flexport's blog
 * Showcases EAC logistics insights, research, and guides
 */
export function Resources() {
  const t = useTranslations("home.resources");

  const resources = [
    {
      type: t("article1.type"),
      title: t("article1.title"),
      excerpt: t("article1.excerpt"),
      date: t("article1.date"),
      readTime: t("article1.readTime"),
      category: t("article1.category"),
      image: "/images/resource-1.jpg",
    },
    {
      type: t("article2.type"),
      title: t("article2.title"),
      excerpt: t("article2.excerpt"),
      date: t("article2.date"),
      readTime: t("article2.readTime"),
      category: t("article2.category"),
      image: "/images/resource-2.jpg",
    },
    {
      type: t("article3.type"),
      title: t("article3.title"),
      excerpt: t("article3.excerpt"),
      date: t("article3.date"),
      readTime: t("article3.readTime"),
      category: t("article3.category"),
      image: "/images/resource-3.jpg",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
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

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <Card 
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-900">
                    {resource.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Type Badge */}
                <div className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                  {resource.type}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {resource.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {resource.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{resource.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{resource.readTime}</span>
                  </div>
                </div>

                {/* Read More */}
                <Button variant="ghost" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 group/btn">
                  {t("readMore")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline" className="group">
              {t("viewAll")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
