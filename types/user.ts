/**
 * User Profile Type Definitions
 * Comprehensive user types for EAC Freight Logistics Platform
 */

export type UserRole = 'admin' | 'driver' | 'shipper';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type DocumentType = 'license' | 'registration' | 'insurance' | 'id' | 'passport' | 'tax_cert' | 'other';
export type EACCountry = 'KE' | 'UG' | 'TZ' | 'RW' | 'BI' | 'SS';
export type Currency = 'KES' | 'UGX' | 'TZS';
export type Language = 'en' | 'sw' | 'fr';
export type Theme = 'light' | 'dark' | 'system';

/**
 * User Document Interface
 */
export interface UserDocument {
  type: DocumentType;
  name: string;
  url: string;
  publicId?: string; // Cloudinary public ID for deletion
  uploadedAt: Date;
  verifiedAt?: Date;
  status: VerificationStatus;
  rejectionReason?: string;
}

/**
 * Emergency Contact Interface
 */
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

/**
 * Payment Method Interface
 */
export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

/**
 * User Preferences Interface
 */
export interface UserPreferences {
  language: Language;
  currency: Currency;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    shipmentUpdates: boolean;
    promotions: boolean;
  };
  theme: Theme;
  timezone?: string;
}

/**
 * Company Information Interface
 */
export interface CompanyInfo {
  name: string;
  id?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Contact Details Interface
 */
export interface ContactDetails {
  phoneNumber: string;
  alternatePhone?: string;
  country: EACCountry;
  city: string;
  address: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Driver Specific Information
 */
export interface DriverInfo {
  licenseNumber: string;
  licenseExpiry: Date;
  licenseClass?: string;
  vehicleId?: string;
  vehicleType?: 'truck' | 'van' | 'pickup' | 'trailer';
  vehiclePlate?: string;
  yearsOfExperience?: number;
  emergencyContact: EmergencyContact;
  currentStatus?: 'available' | 'on_trip' | 'off_duty' | 'maintenance';
}

/**
 * Profile Completion Tracking
 */
export interface ProfileCompletion {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  lastUpdated: Date;
}

/**
 * User Activity Tracking
 */
export interface UserActivity {
  lastLoginAt?: Date;
  loginCount: number;
  lastActiveAt?: Date;
  totalShipments?: number;
  totalRevenue?: number;
}

/**
 * User Status Information
 */
export interface UserStatus {
  isActive: boolean;
  isVerified: boolean;
  isOnboardingComplete: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  suspendedAt?: Date;
  suspendedBy?: string;
}

/**
 * Complete User Profile Interface
 */
export interface UserProfile {
  // Core Identity
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  imageUrl?: string;
  imagePublicId?: string;

  // Role & Authentication
  role: UserRole;
  status: UserStatus;

  // Company Information (for Shippers & Admins)
  company?: CompanyInfo;

  // Contact Details
  contact?: ContactDetails;

  // Driver-Specific Information
  driverInfo?: DriverInfo;

  // Documents & Verification
  documents: UserDocument[];
  
  // Profile Completion
  completion: ProfileCompletion;

  // Payment & Billing
  stripeCustomerId?: string;
  paymentMethods: PaymentMethod[];

  // Preferences
  preferences: UserPreferences;

  // Activity & Stats
  activity: UserActivity;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * User Profile Update DTO
 */
export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  imageUrl?: string;
  imagePublicId?: string;
  
  // Company
  company?: Partial<CompanyInfo>;
  
  // Contact
  contact?: Partial<ContactDetails>;
  
  // Driver Info
  driverInfo?: Partial<DriverInfo>;
  
  // Preferences
  preferences?: Partial<UserPreferences>;
}

/**
 * Profile Form Data (for form validation)
 */
export interface ProfileFormData {
  // Personal
  firstName: string;
  lastName: string;
  displayName?: string;
  phoneNumber: string;
  alternatePhone?: string;
  
  // Location
  country: EACCountry;
  city: string;
  address: string;
  postalCode?: string;
  
  // Company (Shipper/Admin)
  companyName?: string;
  companyRegistrationNumber?: string;
  companyTaxId?: string;
  companyWebsite?: string;
  
  // Driver
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  yearsOfExperience?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  // Preferences
  language?: Language;
  currency?: Currency;
  timezone?: string;
}

/**
 * Required Fields by Role
 */
export const REQUIRED_FIELDS_BY_ROLE: Record<UserRole, (keyof ProfileFormData)[]> = {
  driver: [
    'firstName',
    'lastName',
    'phoneNumber',
    'country',
    'city',
    'address',
    'licenseNumber',
    'licenseExpiry',
    'vehicleType',
    'emergencyContactName',
    'emergencyContactPhone',
  ],
  shipper: [
    'firstName',
    'lastName',
    'phoneNumber',
    'country',
    'city',
    'address',
    'companyName',
  ],
  admin: [
    'firstName',
    'lastName',
    'phoneNumber',
    'country',
    'city',
  ],
};

/**
 * Profile Completion Weights
 */
export const PROFILE_COMPLETION_WEIGHTS = {
  basic: 30, // firstName, lastName, email
  contact: 20, // phone, address, location
  company: 15, // company info (for shippers)
  driver: 15, // license, vehicle (for drivers)
  documents: 20, // uploaded and verified documents
  preferences: 5, // language, currency, etc
  image: 10, // profile picture
};

/**
 * Validation Constants
 */
export const VALIDATION_RULES = {
  phoneNumber: {
    pattern: /^(\+?254|0)[17]\d{8}$/,
    message: 'Invalid phone number format',
  },
  licenseNumber: {
    pattern: /^[A-Z0-9-]+$/,
    message: 'License number should contain only letters, numbers, and hyphens',
  },
  taxId: {
    pattern: /^[A-Z0-9]+$/,
    message: 'Tax ID should contain only letters and numbers',
  },
  postalCode: {
    pattern: /^\d{5}$/,
    message: 'Postal code should be 5 digits',
  },
};

/**
 * Helper type for API responses
 */
export interface UserProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Helper type for profile update response
 */
export interface UpdateProfileResponse {
  success: boolean;
  data?: {
    profile: UserProfile;
    completion: ProfileCompletion;
  };
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Helper function to calculate profile completion
 */
export function calculateCompletion(
  profile: Partial<UserProfile>,
  role: UserRole
): ProfileCompletion {
  const requiredFields = REQUIRED_FIELDS_BY_ROLE[role];
  const completed: string[] = [];
  const missing: string[] = [];

  requiredFields.forEach((field) => {
    const value = getNestedValue(profile, field);
    if (value !== undefined && value !== null && value !== '') {
      completed.push(field);
    } else {
      missing.push(field);
    }
  });

  // Add bonus for image
  if (profile.imageUrl) completed.push('imageUrl');
  else missing.push('imageUrl');

  // Add bonus for verified documents
  const hasVerifiedDocs = profile.documents?.some(doc => doc.status === 'approved');
  if (hasVerifiedDocs) completed.push('verifiedDocuments');
  else missing.push('verifiedDocuments');

  const basePercentage = (completed.length / (requiredFields.length + 2)) * 100;
  const percentage = Math.min(100, Math.round(basePercentage));

  return {
    percentage,
    completedFields: completed,
    missingFields: missing,
    lastUpdated: new Date(),
  };
}

/**
 * Helper to get nested value
 */
function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.');
  let value = obj;
  for (const part of parts) {
    if (value?.[part] === undefined) return undefined;
    value = value[part];
  }
  return value;
}
