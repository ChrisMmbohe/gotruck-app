/**
 * Profile Info Step - Basic personal information
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.enum(["KE", "UG", "TZ", "RW", "BI", "SS"]),
  city: z.string().min(2, "City is required"),
});

interface ProfileInfoStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function ProfileInfoStep({ data, onChange, onNext }: ProfileInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phoneNumber: data.phoneNumber || "",
    country: data.country || "KE",
    city: data.city || "",
  });

  const countries = [
    { value: "KE", label: "🇰🇪 Kenya" },
    { value: "UG", label: "🇺🇬 Uganda" },
    { value: "TZ", label: "🇹🇿 Tanzania" },
    { value: "RW", label: "🇷🇼 Rwanda" },
    { value: "BI", label: "🇧🇮 Burundi" },
    { value: "SS", label: "🇸🇸 South Sudan" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    onChange(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold">Your Profile Information</h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="+254 700 000 000"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="pl-10"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <select
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nairobi"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          Continue
        </Button>
      </div>
    </form>
  );
}
