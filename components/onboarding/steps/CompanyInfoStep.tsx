/**
 * Company Info Step - Business information for Shippers
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Hash, FileText, MapPin } from "lucide-react";
import { z } from "zod";

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  postalCode: z.string().optional(),
});

interface CompanyInfoStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export function CompanyInfoStep({ data, onChange, onNext }: CompanyInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    companyName: data.companyName || "",
    businessRegistrationNumber: data.businessRegistrationNumber || "",
    taxId: data.taxId || "",
    address: data.address || "",
    postalCode: data.postalCode || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = companySchema.safeParse(formData);

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
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Building2 className="h-8 w-8 text-slate-700" />
        </div>
        <h2 className="text-2xl font-bold">Company Information</h2>
        <p className="text-muted-foreground">
          Help us understand your business to provide better service
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Acme Logistics Ltd."
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="pl-10"
            />
          </div>
          {errors.companyName && (
            <p className="text-sm text-red-500">{errors.companyName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Business Registration Number
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="BRN12345"
                value={formData.businessRegistrationNumber}
                onChange={(e) =>
                  handleChange("businessRegistrationNumber", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tax ID / VAT Number</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="A001234567Z"
                value={formData.taxId}
                onChange={(e) => handleChange("taxId", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Business Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              placeholder="123 Main Street, Building A, Floor 5"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={3}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Postal Code</label>
          <Input
            placeholder="00100"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
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
