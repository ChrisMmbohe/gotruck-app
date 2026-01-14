/**
 * User Role Types for GoTruck EAC Platform
 * Supports multi-tenant authentication with three user types
 */

export enum UserRole {
  DRIVER = 'driver',
  SHIPPER = 'shipper',
  ADMIN = 'admin',
}

export interface UserMetadata {
  role: UserRole;
  companyId?: string;
  companyName?: string;
  phoneNumber?: string;
  country?: 'KE' | 'UG' | 'TZ' | 'RW' | 'BI' | 'SS';
  licenseNumber?: string; // For drivers
  vehicleId?: string; // For drivers
  isVerified: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
}

export interface ClerkUserPublicMetadata extends Partial<UserMetadata> {
  role: UserRole;
}

export interface ClerkUserPrivateMetadata {
  stripeCustomerId?: string;
  lastLoginAt?: Date;
  loginCount?: number;
}

/**
 * Permission matrix for role-based access control
 */
export const PERMISSIONS = {
  // Dashboard access
  VIEW_DASHBOARD: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  
  // Shipment permissions
  CREATE_SHIPMENT: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  VIEW_SHIPMENT: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  EDIT_SHIPMENT: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  DELETE_SHIPMENT: [UserRole.ADMIN] as UserRole[],
  ASSIGN_DRIVER: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  
  // Tracking permissions
  VIEW_TRACKING: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  UPDATE_GPS: [UserRole.DRIVER] as UserRole[],
  
  // Fleet management
  VIEW_FLEET: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  MANAGE_FLEET: [UserRole.ADMIN] as UserRole[],
  VIEW_VEHICLES: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  
  // Financial permissions
  VIEW_INVOICES: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  CREATE_INVOICE: [UserRole.ADMIN] as UserRole[],
  VIEW_PAYMENTS: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  PROCESS_PAYMENT: [UserRole.ADMIN] as UserRole[],
  
  // Analytics
  VIEW_ANALYTICS: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  VIEW_ADVANCED_ANALYTICS: [UserRole.ADMIN] as UserRole[],
  
  // User management
  MANAGE_USERS: [UserRole.ADMIN] as UserRole[],
  VIEW_DRIVERS: [UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  
  // Settings
  VIEW_SETTINGS: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN] as UserRole[],
  MANAGE_SETTINGS: [UserRole.ADMIN] as UserRole[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Route protection configuration
 */
export const PROTECTED_ROUTES = {
  public: [
    '/',
    '/sign-in',
    '/sign-up',
    '/about',
    '/contact',
    '/pricing',
  ],
  authenticated: [
    '/dashboard',
    '/dashboard/tracking',
    '/dashboard/fleet',
    '/dashboard/shipments',
    '/dashboard/analytics',
    '/dashboard/settings',
    '/onboarding',
  ],
  driver: [
    '/dashboard/tracking',
    '/dashboard/shipments',
    '/dashboard/settings',
  ],
  shipper: [
    '/dashboard',
    '/dashboard/tracking',
    '/dashboard/fleet',
    '/dashboard/shipments',
    '/dashboard/analytics',
    '/dashboard/settings',
  ],
  admin: [
    '/dashboard',
    '/dashboard/tracking',
    '/dashboard/fleet',
    '/dashboard/shipments',
    '/dashboard/analytics',
    '/dashboard/settings',
    '/dashboard/users',
    '/dashboard/compliance',
  ],
} as const;

/**
 * Default redirect paths after authentication
 */
export const DEFAULT_REDIRECTS = {
  [UserRole.DRIVER]: '/dashboard/tracking',
  [UserRole.SHIPPER]: '/dashboard',
  [UserRole.ADMIN]: '/dashboard/analytics',
} as const;
