"use client";

import { useTranslations } from "next-intl";
import { 
  Truck, 
  MapPin, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe, 
  Brain,
  FileCheck,
  DollarSign,
  Clock,
  Radio,
  Package
} from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * Features Section - Inspired by Samsara's comprehensive solution grid and Geotab's connected intelligence
 * Showcases EAC-specific capabilities with AI emphasis like Motive
 */
export function Features() {
  const t = useTranslations("home.features");

  const features = [
    {
      icon: Brain,
      title: t("aiSafety.title"),
      description: t("aiSafety.description"),
      gradient: "from-purple-500 to-pink-500",
      // Inspired by Samsara's AI-powered safety features
    },
    {
      icon: MapPin,
      title: t("realTimeTracking.title"),
      description: t("realTimeTracking.description"),
      gradient: "from-blue-500 to-cyan-500",
      // Core feature across all platforms - adapted for EAC cross-border
    },
    {
      icon: BarChart3,
      title: t("analytics.title"),
      description: t("analytics.description"),
      gradient: "from-green-500 to-emerald-500",
      // Predictive analytics inspired by Geotab's intelligence platform
    },
    {
      icon: FileCheck,
      title: t("compliance.title"),
      description: t("compliance.description"),
      gradient: "from-orange-500 to-red-500",
      // EAC-specific: Customs and cross-border compliance automation
    },
    {
      icon: DollarSign,
      title: t("multiCurrency.title"),
      description: t("multiCurrency.description"),
      gradient: "from-yellow-500 to-amber-500",
      // Regional payment handling for KES, UGX, TZS
    },
    {
      icon: Shield,
      title: t("security.title"),
      description: t("security.description"),
      gradient: "from-indigo-500 to-purple-500",
      // Cargo security - critical for long-distance EAC routes
    },
    {
      icon: Radio,
      title: t("iot.title"),
      description: t("iot.description"),
      gradient: "from-teal-500 to-green-500",
      // IoT sensors inspired by Geotab's telematics
    },
    {
      icon: Zap,
      title: t("automation.title"),
      description: t("automation.description"),
      gradient: "from-pink-500 to-rose-500",
      // Workflow automation like Flexport's end-to-end platform
    },
    {
      icon: Globe,
      title: t("eacNetwork.title"),
      description: t("eacNetwork.description"),
      gradient: "from-blue-600 to-indigo-600",
      // Regional network emphasis - Djibouti Corridor, Northern Corridor
    },
    {
      icon: Clock,
      title: t("efficiency.title"),
      description: t("efficiency.description"),
      gradient: "from-cyan-500 to-blue-500",
      // Time savings metrics like Uber Freight
    },
    {
      icon: Package,
      title: t("inventory.title"),
      description: t("inventory.description"),
      gradient: "from-violet-500 to-purple-500",
      // Warehouse integration inspired by CargoWise
    },
    {
      icon: Truck,
      title: t("fleetManagement.title"),
      description: t("fleetManagement.description"),
      gradient: "from-emerald-500 to-teal-500",
      // Comprehensive fleet management like Motive
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header - Clean and bold like Uber Freight */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid - Responsive layout inspired by Geotab */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-gray-200 group"
              >
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Integration Partners Section - Inspired by CargoWise's ecosystem */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-8 font-medium">
            {t("integrations")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for partner logos */}
            <div className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-400">Stripe</div>
            <div className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-400">Mapbox</div>
            <div className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-400">AWS</div>
            <div className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-400">MongoDB</div>
            <div className="px-6 py-3 bg-gray-100 rounded-lg font-bold text-gray-400">Redis</div>
          </div>
        </div>
      </div>
    </section>
  );
}
