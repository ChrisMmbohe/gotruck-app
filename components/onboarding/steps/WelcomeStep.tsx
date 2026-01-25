/**
 * Welcome Step - Introduction to GoTruck Platform
 */

import { Button } from "@/components/ui/button";
import { Truck, MapPin, BarChart3, Shield } from "lucide-react";

interface WelcomeStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: Truck,
      title: "Real-Time Tracking",
      description: "Track your shipments across East Africa with live GPS updates",
    },
    {
      icon: MapPin,
      title: "Route Optimization",
      description: "AI-powered route planning for efficient deliveries",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights into your logistics operations",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data and transactions",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
          <Truck className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to GoTruck!</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The leading freight logistics platform for East African Community.
          Let's get you set up in just a few steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="p-4 border rounded-lg hover:border-slate-400 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          Get Started
        </Button>
      </div>
    </div>
  );
}
