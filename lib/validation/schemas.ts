/**
 * Zod Validation Schemas for Database Operations
 * Critical data integrity validation for all database interactions
 */

import { z } from "zod";

// ============================================
// Common Validation Rules
// ============================================

export const EACCountries = ["KE", "UG", "TZ", "RW", "BI", "SS"] as const;
export const EACCurrencies = ["KES", "UGX", "TZS"] as const;
export const Languages = ["en", "sw", "fr"] as const;
export const UserRoles = ["driver", "shipper", "admin"] as const;
export const VehicleTypes = [
  "pickup", "box_truck", "semi_truck", "flatbed", "refrigerated", "van", "other",
  "Pickup Truck", "Box Truck", "Semi-Truck", "Flatbed Truck", "Refrigerated Truck", "Van", "Other"
] as const;

// Phone number validation (E.164 format or 10-15 digits)
const phoneNumberSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number format");

// Email validation
const emailSchema = z.string().email("Invalid email address").toLowerCase();

// Name validation (no special characters except spaces, hyphens, apostrophes)
const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

// License number validation (alphanumeric, 5-20 chars)
const licenseNumberSchema = z.string()
  .min(5, "License number must be at least 5 characters")
  .max(20, "License number must not exceed 20 characters")
  .regex(/^[A-Z0-9-]+$/, "License number must be alphanumeric (uppercase)")
  .transform(val => val.toUpperCase());

// Vehicle plate validation (alphanumeric with spaces/hyphens)
// Supports EAC formats: KAA 123A (Kenya), UAA 123B (Uganda), TZA 1234 (Tanzania)
const vehiclePlateSchema = z.string()
  .min(3, "Plate number must be at least 3 characters")
  .max(15, "Plate number must not exceed 15 characters")
  .regex(/^[A-Z0-9\s-]+$/i, "Plate number must contain only letters, numbers, spaces, and hyphens")
  .transform(val => val.toUpperCase().trim());

// ============================================
// User Profile Validation Schema
// ============================================

export const userProfileSchema = z.object({
  // Clerk Integration (Required)
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: emailSchema,

  // Basic Info
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),

  // Role & Auth
  role: z.enum(UserRoles, {
    errorMap: () => ({ message: "Role must be driver, shipper, or admin" }),
  }),
  isVerified: z.boolean().default(false),
  onboardingComplete: z.boolean().default(false),

  // Company Information (for Shipper & Admin)
  companyName: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must not exceed 200 characters")
    .optional(),
  companyId: z.string().optional(),
  businessRegistrationNumber: z.string()
    .max(50, "Registration number must not exceed 50 characters")
    .optional(),
  taxId: z.string()
    .max(50, "Tax ID must not exceed 50 characters")
    .optional(),

  // Contact Details
  phoneNumber: phoneNumberSchema.optional(),
  alternatePhone: phoneNumberSchema.optional(),
  country: z.enum(EACCountries, {
    errorMap: () => ({ message: "Country must be one of: KE, UG, TZ, RW, BI, SS" }),
  }).optional(),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters")
    .optional(),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must not exceed 500 characters")
    .optional(),
  postalCode: z.string()
    .max(20, "Postal code must not exceed 20 characters")
    .optional(),

  // Driver-Specific Fields
  licenseNumber: licenseNumberSchema.optional(),
  licenseExpiry: z.coerce.date()
    .refine(date => date > new Date(), "License expiry must be a future date")
    .optional(),
  vehicleId: z.string().optional(),
  vehicleType: z.enum(VehicleTypes).optional(),
  vehiclePlate: vehiclePlateSchema.optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneNumberSchema,
    relationship: z.string()
      .min(2, "Relationship must be at least 2 characters")
      .max(50, "Relationship must not exceed 50 characters"),
  }).optional(),

  // Verification & Documents
  documents: z.array(z.object({
    type: z.enum(["license", "registration", "insurance", "id", "passport", "tax_cert", "other"]),
    name: z.string().min(1, "Document name is required"),
    url: z.string().url("Invalid document URL"),
    uploadedAt: z.coerce.date(),
    verifiedAt: z.coerce.date().optional(),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
    rejectionReason: z.string().optional(),
  })).optional(),

  // Profile Completion
  profileCompletionPercentage: z.number()
    .min(0, "Completion percentage must be at least 0")
    .max(100, "Completion percentage must not exceed 100")
    .default(0),
  requiredFieldsCompleted: z.array(z.string()).default([]),
  missingFields: z.array(z.string()).default([]),

  // Stripe Integration
  stripeCustomerId: z.string().optional(),
  paymentMethods: z.array(z.object({
    id: z.string(),
    type: z.string(),
    last4: z.string().length(4, "Last4 must be exactly 4 digits"),
    expiryMonth: z.number().min(1).max(12).optional(),
    expiryYear: z.number().min(new Date().getFullYear()).optional(),
  })).optional(),

  // Settings & Preferences
  preferences: z.object({
    language: z.enum(Languages).default("en"),
    currency: z.enum(EACCurrencies).default("KES"),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(true),
      push: z.boolean().default(true),
    }).default({ email: true, sms: true, push: true }),
    theme: z.enum(["light", "dark", "system"]).default("system"),
  }).optional(),

  // Activity Tracking
  lastLoginAt: z.coerce.date().optional(),
  loginCount: z.number().int().min(0).default(0),
  lastActiveAt: z.coerce.date().optional(),

  // Status
  isActive: z.boolean().default(true),
  isSuspended: z.boolean().default(false),
  suspensionReason: z.string().optional(),

  // Timestamps
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
  deletedAt: z.coerce.date().optional(),
});

// ============================================
// Onboarding Validation Schemas
// ============================================

export const roleAssignmentSchema = z.object({
  role: z.enum(UserRoles, {
    errorMap: () => ({ message: "Role must be driver, shipper, or admin" }),
  }),
});

export const onboardingCompleteSchema = z.object({
  // Basic Info (Required for all roles)
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneNumberSchema,
  country: z.enum(EACCountries),
  city: z.string().min(2, "City is required"),

  // Company Info (Required for Shipper role)
  companyName: z.string().min(2).optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().min(5).optional(),
  postalCode: z.string().optional(),

  // Driver Info (Required for Driver role)
  licenseNumber: licenseNumberSchema.optional(),
  licenseExpiry: z.coerce.date()
    .refine(date => date > new Date(), "License must not be expired")
    .optional(),
  vehicleType: z.enum(VehicleTypes).optional(),
  vehiclePlate: vehiclePlateSchema.optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneNumberSchema,
    relationship: z.string().min(2),
  }).optional(),

  // Preferences (Optional)
  language: z.enum(Languages).default("en"),
  currency: z.enum(EACCurrencies).default("KES"),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(true),
    push: z.boolean().default(true),
  }).optional(),

  // Documents (Optional)
  documents: z.array(z.object({
    type: z.enum(["license", "registration", "insurance", "id", "passport", "tax_cert", "other"]),
    name: z.string(),
    url: z.string().url(),
  })).optional(),
});

// Role-specific validation refinement
export const validateOnboardingByRole = (data: z.infer<typeof onboardingCompleteSchema>, role: string) => {
  const errors: string[] = [];

  if (role === "shipper") {
    if (!data.companyName || data.companyName.length < 2) {
      errors.push("Company name is required for shippers");
    }
    if (!data.address || data.address.length < 5) {
      errors.push("Business address is required for shippers");
    }
  }

  if (role === "driver") {
    if (!data.licenseNumber) {
      errors.push("License number is required for drivers");
    }
    if (!data.licenseExpiry) {
      errors.push("License expiry date is required for drivers");
    }
    if (!data.vehicleType) {
      errors.push("Vehicle type is required for drivers");
    }
    if (!data.vehiclePlate) {
      errors.push("Vehicle plate number is required for drivers");
    }
    if (!data.emergencyContact) {
      errors.push("Emergency contact is required for drivers");
    }
  }

  return errors;
};

// ============================================
// Type Exports
// ============================================

export type UserProfileData = z.infer<typeof userProfileSchema>;
export type RoleAssignmentData = z.infer<typeof roleAssignmentSchema>;
export type OnboardingCompleteData = z.infer<typeof onboardingCompleteSchema>;
