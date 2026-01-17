"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, Users, MapPin, Package } from "lucide-react";

/**
 * Stats Banner - Inspired by Uber Freight's impact metrics and Flexport's global reach
 * Displays key EAC platform statistics with visual appeal
 */
export function StatsBanner() {
  const t = useTranslations("home.stats");

  const stats = [
    {
      icon: MapPin,
      value: t("countries.value"),
      label: t("countries.label"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      value: t("users.value"),
      label: t("users.label"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Package,
      value: t("shipments.value"),
      label: t("shipments.label"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      value: t("savings.value"),
      label: t("savings.label"),
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-slate-200 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
