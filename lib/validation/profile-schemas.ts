/**
 * Profile Form Validation Schemas
 * Zod schemas for user profile validation
 */

import { z } from 'zod';

// Phone number regex for EAC countries
const phoneRegex = /^\+?(254|256|255|250|257|211)[0-9]{9}$/;

// Base personal info schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  displayName: z.string().max(100).optional(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
  alternatePhone: z.string().regex(phoneRegex, 'Invalid phone number format').optional().or(z.literal('')),
});

// Contact details schema
export const contactDetailsSchema = z.object({
  country: z.enum(['KE', 'UG', 'TZ', 'RW', 'BI', 'SS']),
  city: z.string().min(2, 'City is required').max(100),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200),
  postalCode: z.string().max(10).optional().or(z.literal('')),
});

// Company info schema (for shippers)
export const companyInfoSchema = z.object({
  companyName: z.string().min(2, 'Company name is required').max(100),
  companyRegistrationNumber: z.string().max(50).optional().or(z.literal('')),
  companyTaxId: z.string().max(50).optional().or(z.literal('')),
  companyWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Driver info schema
export const driverInfoSchema = z.object({
  licenseNumber: z.string().min(3, 'License number is required').max(50),
  licenseExpiry: z.string().refine(
    (date) => {
      const expiryDate = new Date(date);
      return expiryDate > new Date();
    },
    { message: 'License has expired' }
  ),
  vehicleType: z.enum(['truck', 'van', 'pickup', 'trailer']),
  vehiclePlate: z.string().max(20).optional().or(z.literal('')),
  yearsOfExperience: z.coerce.number().min(0).max(50).optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required').max(100),
  emergencyContactPhone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  emergencyContactRelationship: z.string().max(50).optional().or(z.literal('')),
});

// Preferences schema
export const preferencesSchema = z.object({
  language: z.enum(['en', 'sw', 'fr']),
  currency: z.enum(['KES', 'UGX', 'TZS']),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    shipmentUpdates: z.boolean(),
    promotions: z.boolean(),
  }).optional(),
});

// Complete profile schemas by role
export const shipperProfileSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactDetailsSchema.shape,
  ...companyInfoSchema.shape,
  ...preferencesSchema.shape,
});

export const driverProfileSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactDetailsSchema.shape,
  ...driverInfoSchema.shape,
  ...preferencesSchema.shape,
});

export const adminProfileSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactDetailsSchema.shape,
  ...preferencesSchema.shape,
});

// Type exports
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type DriverInfoFormData = z.infer<typeof driverInfoSchema>;
export type PreferencesFormData = z.infer<typeof preferencesSchema>;
export type ShipperProfileFormData = z.infer<typeof shipperProfileSchema>;
export type DriverProfileFormData = z.infer<typeof driverProfileSchema>;
export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;
