/**
 * Driver Info Step - Driver-specific information
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, CreditCard, Calendar, User, Phone } from "lucide-react";
import { z } from "zod";

const driverSchema = z.object({
  licenseNumber: z.string().min(5, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  vehicleType: z.string().min(2, "Vehicle type is required"),
  vehiclePlate: z.string().min(3, "Vehicle plate number is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
});

interface DriverInfoStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function DriverInfoStep({ data, onChange, onNext }: DriverInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    licenseNumber: data.licenseNumber || "",
    licenseExpiry: data.licenseExpiry || "",
    vehicleType: data.vehicleType || "",
    vehiclePlate: data.vehiclePlate || "",
    emergencyContactName: data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyContactPhone || "",
    emergencyContactRelationship: data.emergencyContactRelationship || "",
  });

  const vehicleTypes = [
    "Pickup Truck",
    "Box Truck",
    "Semi-Truck",
    "Flatbed Truck",
    "Refrigerated Truck",
    "Van",
    "Other",
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = driverSchema.safeParse(formData);

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

    onChange({
      ...formData,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship,
      },
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Truck className="h-8 w-8 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold">Driver Information</h2>
        <p className="text-muted-foreground">
          Provide your license and vehicle details
        </p>
      </div>

      <div className="space-y-4">
        {/* License Information */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            License Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                License Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="DL123456789"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.licenseNumber && (
                <p className="text-sm text-red-500">{errors.licenseNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleChange("licenseExpiry", e.target.value)}
                  className="pl-10"
                />
              </div>
              {errors.licenseExpiry && (
                <p className="text-sm text-red-500">{errors.licenseExpiry}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Vehicle Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => handleChange("vehicleType", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.vehicleType && (
                <p className="text-sm text-red-500">{errors.vehicleType}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="KAA 123X"
                  value={formData.vehiclePlate}
                  onChange={(e) => handleChange("vehiclePlate", e.target.value)}
                  className="pl-10 uppercase"
                />
              </div>
              {errors.vehiclePlate && (
                <p className="text-sm text-red-500">{errors.vehiclePlate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Emergency Contact
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Jane Doe"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    handleChange("emergencyContactName", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              {errors.emergencyContactName && (
                <p className="text-sm text-red-500">{errors.emergencyContactName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleChange("emergencyContactPhone", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContactPhone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Spouse"
                  value={formData.emergencyContactRelationship}
                  onChange={(e) =>
                    handleChange("emergencyContactRelationship", e.target.value)
                  }
                />
                {errors.emergencyContactRelationship && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContactRelationship}
                  </p>
                )}
              </div>
            </div>
          </div>
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
