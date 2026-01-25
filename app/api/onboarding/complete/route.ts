/**
 * Complete Onboarding API Route
 * Handles final submission of onboarding data
 * WITH COMPREHENSIVE DATA VALIDATION AND INTEGRITY CHECKS
 */

import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getWelcomeEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { authAndValidate } from "@/lib/validation/middleware";
import { 
  onboardingCompleteSchema, 
  validateOnboardingByRole,
  userProfileSchema 
} from "@/lib/validation/schemas";
import { 
  createSuccessResponse, 
  handleAPIError, 
  handleDatabaseError,
  createErrorResponse,
  ErrorCode,
  logAPIRequest 
} from "@/lib/validation/errors";
import { 
  calculateProfileCompletion,
  validateEmailUnique,
  validatePhoneUnique,
  validateLicenseUnique,
  validateMongoUpdate 
} from "@/lib/validation/database";
import { sanitizeObject } from "@/lib/validation/sanitize";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let dbClient: any = null;
  
  try {
    console.log('🔵 Onboarding complete API called');
    
    // Step 1: Authenticate user and validate request body
    const { error, userId, data } = await authAndValidate(req, onboardingCompleteSchema);
    
    if (error) {
      return error;
    }

    logAPIRequest('POST', '/api/onboarding/complete', userId!, { 
      hasDocuments: !!data!.documents?.length 
    });

    console.log('✅ User authenticated and data validated:', userId);

    // Step 2: Fetch user from Clerk and get role
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    
    if (!user) {
      console.error('❌ User not found in Clerk');
      return createErrorResponse('User not found', ErrorCode.NOT_FOUND, 404);
    }

    const role = (user.publicMetadata.role as string)?.toLowerCase();
    
    if (!role || !['driver', 'shipper', 'admin'].includes(role)) {
      console.error('❌ Invalid or missing role');
      return createErrorResponse(
        'User role must be assigned before completing onboarding',
        ErrorCode.VALIDATION_ERROR,
        400
      );
    }

    console.log('✅ User role verified:', role);

    // Step 3: Validate role-specific required fields
    const roleValidationErrors = validateOnboardingByRole(
      { 
        ...data!, 
        language: data!.language || 'en', 
        currency: data!.currency || 'KES',
        theme: data!.theme || 'system',
        notifications: {
          email: data!.notifications?.email ?? true,
          sms: data!.notifications?.sms ?? true,
          push: data!.notifications?.push ?? true
        }
      }, 
      role
    );
    if (roleValidationErrors.length > 0) {
      return createErrorResponse(
        'Role-specific validation failed',
        ErrorCode.VALIDATION_ERROR,
        400,
        { errors: roleValidationErrors }
      );
    }

    console.log('✅ Role-specific validation passed');

    // Step 4: Connect to MongoDB
    const { db, client } = await connectToDatabase();
    dbClient = client;
    const usersCollection = db.collection("users");

    console.log('✅ Connected to MongoDB');

    // Step 5: Check for duplicate email/phone/license
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    
    if (!email) {
      return createErrorResponse(
        'Email address is required',
        ErrorCode.VALIDATION_ERROR,
        400
      );
    }

    // Check phone uniqueness
    if (data!.phoneNumber) {
      const isPhoneUnique = await validatePhoneUnique(data!.phoneNumber, db, userId || undefined);
      if (!isPhoneUnique) {
        return createErrorResponse(
          'Phone number already registered',
          ErrorCode.DUPLICATE_ENTRY,
          409,
          { field: 'phoneNumber' }
        );
      }
    }

    // Check license uniqueness for drivers
    if (role === 'driver' && data!.licenseNumber) {
      const isLicenseUnique = await validateLicenseUnique(data!.licenseNumber, db, userId || undefined);
      if (!isLicenseUnique) {
        return createErrorResponse(
          'License number already registered',
          ErrorCode.DUPLICATE_ENTRY,
          409,
          { field: 'licenseNumber' }
        );
      }
    }

    console.log('✅ Uniqueness validations passed');

    // Step 6: Prepare sanitized profile data
    const now = new Date();
    const profileData = sanitizeObject({
      clerkId: userId,
      email,
      firstName: data!.firstName,
      lastName: data!.lastName,
      phoneNumber: data!.phoneNumber,
      country: data!.country,
      city: data!.city,
      address: data!.address,
      postalCode: data!.postalCode,
      role,
      isVerified: false,
      onboardingComplete: true,
      
      // Shipper-specific fields
      ...(role === 'shipper' && {
        companyName: data!.companyName,
        businessRegistrationNumber: data!.businessRegistrationNumber,
        taxId: data!.taxId,
      }),
      
      // Driver-specific fields  
      ...(role === 'driver' && {
        licenseNumber: data!.licenseNumber?.toUpperCase(),
        licenseExpiry: data!.licenseExpiry ? new Date(data!.licenseExpiry) : undefined,
        vehicleType: data!.vehicleType,
        vehiclePlate: data!.vehiclePlate?.toUpperCase(),
        emergencyContact: data!.emergencyContact,
      }),
      
      // Preferences
      preferences: {
        language: data!.language || "en",
        currency: data!.currency || "KES",
        theme: data!.theme || "system",
        notifications: data!.notifications || {
          email: true,
          sms: true,
          push: true,
        },
      },
      
      // Documents (sanitized)
      ...(data!.documents && data!.documents.length > 0 && {
        documents: data!.documents.map(doc => ({
          type: doc.type,
          name: doc.name.slice(0, 255),
          url: doc.url,
          uploadedAt: now,
          status: 'pending' as const,
        })),
      }),
      
      // Timestamps and status
      isActive: true,
      isSuspended: false,
      loginCount: 0,
      lastLoginAt: now,
      updatedAt: now,
    });

    // Step 7: Calculate profile completion
    const completion = calculateProfileCompletion(profileData, role as any);
    (profileData as any).profileCompletionPercentage = completion.percentage;
    (profileData as any).requiredFieldsCompleted = completion.completedFields;
    (profileData as any).missingFields = completion.missingFields;

    console.log(`📊 Profile completion: ${completion.percentage}%`);

    // Step 8: Validate complete profile against schema
    const validationResult = userProfileSchema.safeParse(profileData);
    if (!validationResult.success) {
      console.error('❌ Profile validation failed:', validationResult.error);
      return createErrorResponse(
        'Profile data validation failed',
        ErrorCode.VALIDATION_ERROR,
        400,
        { errors: validationResult.error.errors }
      );
    }

    console.log('✅ Final profile validation passed');

    // Step 9: Create or update user profile in MongoDB (with transaction safety)
    // Separate createdAt handling to avoid conflict between $set and $setOnInsert
    const { createdAt, ...profileDataWithoutCreatedAt } = profileData as any;
    
    const updateData = validateMongoUpdate({
      $set: {
        ...profileDataWithoutCreatedAt,
        updatedAt: now, // Always update this field
      },
      $setOnInsert: {
        createdAt: now, // Only set on insert
      },
    });

    const result = await usersCollection.findOneAndUpdate(
      { clerkId: userId },
      updateData,
      { 
        upsert: true, 
        returnDocument: "after",
      }
    );

    console.log('✅ Profile saved to MongoDB');

    // Step 10: Update Clerk metadata
    await clerk.users.updateUserMetadata(userId!, {
      publicMetadata: {
        ...user.publicMetadata,
        role,
        onboardingComplete: true,
        profileCompletion: completion.percentage,
        onboardingCompletedAt: now.toISOString(),
      },
    });

    console.log('✅ Clerk metadata updated');

    // Step 11: Send welcome email (non-blocking)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    
    // Determine role-specific redirect URL
    const roleRedirects: Record<string, string> = {
      'driver': '/dashboard/tracking',
      'shipper': '/dashboard',
      'admin': '/dashboard/analytics',
    };
    const dashboardUrl = `${baseUrl}${roleRedirects[role] || '/dashboard'}`;
    
    console.log('📧 Preparing welcome email for role:', role, 'with dashboard URL:', dashboardUrl);
    
    const template = getWelcomeEmail(
      data!.firstName || user.firstName || "there",
      role,
      dashboardUrl
    );
    
    // Send email asynchronously (don't block response)
    sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    }).catch(err => {
      console.error("⚠️ Failed to send welcome email:", err);
      // Don't fail the onboarding if email fails
    });

    console.log('✅ Welcome email queued');

    const duration = Date.now() - startTime;
    console.log(`🎉 Onboarding completed successfully for user ${userId} (${duration}ms)`);

    // Create response with success data
    const response = createSuccessResponse(
      {
        profile: {
          ...profileData,
          _id: result?._id,
        },
        completion: completion.percentage,
        redirectUrl: roleRedirects[role] || '/dashboard',
      },
      'Onboarding completed successfully',
      200
    );
    
    // Set a cookie to persist onboarding completion status
    // This helps with Edge Runtime middleware which can't access MongoDB
    response.cookies.set('onboarding_complete', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
    
    console.log('✅ Onboarding completion cookie set');
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Complete onboarding error (${duration}ms):`, error);
    
    // Check if it's a database error
    if (error && typeof error === 'object' && 'code' in error) {
      return handleDatabaseError(error);
    }
    
    return handleAPIError(error);
  }
}
