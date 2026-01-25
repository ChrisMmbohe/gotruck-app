/**
 * User Metadata Management for Clerk Multi-Tenant Setup
 * Handles setting and updating user metadata during sign-up and profile updates
 */

import { UserRole, UserMetadata, ClerkUserPublicMetadata, ClerkUserPrivateMetadata } from './roles';
import { clerkClient } from '@clerk/nextjs/server';

/**
 * Set user metadata during sign-up
 */
export async function setUserMetadata(
  userId: string,
  role: UserRole,
  additionalData?: Partial<UserMetadata>
): Promise<void> {
  const publicMetadata: ClerkUserPublicMetadata = {
    role,
    isVerified: false,
    onboardingComplete: false,
    createdAt: new Date(),
    ...additionalData,
  };

  const privateMetadata: ClerkUserPrivateMetadata = {
    lastLoginAt: new Date(),
    loginCount: 1,
  };

  await (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: publicMetadata as any,
    privateMetadata: privateMetadata as any,
  });
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(
  userId: string,
  updates: Partial<UserMetadata>
): Promise<void> {
  const user = await (await clerkClient()).users.getUser(userId);
  const currentMetadata = user.publicMetadata as any as ClerkUserPublicMetadata;

  const updatedMetadata: ClerkUserPublicMetadata = {
    ...currentMetadata,
    ...updates,
  };

  await (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: updatedMetadata as any,
  });
}

/**
 * Mark user as verified
 */
export async function markUserAsVerified(userId: string): Promise<void> {
  await updateUserMetadata(userId, { isVerified: true });
}

/**
 * Mark onboarding as complete
 */
export async function completeOnboarding(userId: string): Promise<void> {
  await updateUserMetadata(userId, { onboardingComplete: true });
}

/**
 * Update login tracking
 */
export async function updateLoginTracking(userId: string): Promise<void> {
  const user = await (await clerkClient()).users.getUser(userId);
  const privateMetadata = user.privateMetadata as ClerkUserPrivateMetadata;

  const updatedPrivateMetadata: ClerkUserPrivateMetadata = {
    ...privateMetadata,
    lastLoginAt: new Date(),
    loginCount: (privateMetadata.loginCount || 0) + 1,
  };

  await (await clerkClient()).users.updateUserMetadata(userId, {
    privateMetadata: updatedPrivateMetadata as any,
  });
}

/**
 * Get user metadata from Clerk
 */
export async function getUserMetadataById(userId: string): Promise<UserMetadata | null> {
  try {
    const user = await (await clerkClient()).users.getUser(userId);
    const metadata = user.publicMetadata as Partial<UserMetadata>;

    if (!metadata.role) {
      return null;
    }

    return {
      role: metadata.role,
      companyId: metadata.companyId,
      companyName: metadata.companyName,
      phoneNumber: metadata.phoneNumber,
      country: metadata.country,
      licenseNumber: metadata.licenseNumber,
      vehicleId: metadata.vehicleId,
      isVerified: metadata.isVerified || false,
      onboardingComplete: metadata.onboardingComplete || false,
      createdAt: metadata.createdAt || new Date(),
    };
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    return null;
  }
}

/**
 * Initialize default metadata for a new user
 */
export function getDefaultMetadata(role: UserRole): Partial<UserMetadata> {
  const baseMetadata: Partial<UserMetadata> = {
    role,
    isVerified: false,
    onboardingComplete: false,
    createdAt: new Date(),
  };

  // Role-specific defaults
  switch (role) {
    case UserRole.DRIVER:
      return {
        ...baseMetadata,
        // Drivers will need to complete verification
      };
    case UserRole.SHIPPER:
      return {
        ...baseMetadata,
        // Shippers might need company info
      };
    case UserRole.ADMIN:
      return {
        ...baseMetadata,
        isVerified: true, // Admins are auto-verified
      };
    default:
      return baseMetadata;
  }
}
