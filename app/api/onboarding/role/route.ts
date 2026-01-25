/**
 * Role Assignment API Endpoint
 * Updates user's role in Clerk metadata during onboarding
 * WITH COMPREHENSIVE DATA VALIDATION AND INTEGRITY CHECKS
 */

import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { authAndValidate } from "@/lib/validation/middleware";
import { roleAssignmentSchema } from "@/lib/validation/schemas";
import { createSuccessResponse, handleAPIError, logAPIRequest } from "@/lib/validation/errors";
import { sanitizeString } from "@/lib/validation/sanitize";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Step 1: Authenticate user and validate request body
    const { error, userId, data } = await authAndValidate(req, roleAssignmentSchema);
    
    if (error) {
      return error;
    }

    logAPIRequest('POST', '/api/onboarding/role', userId!, { role: data!.role });

    // Step 2: Sanitize input (additional security layer)
    const sanitizedRole = sanitizeString(data!.role);

    // Step 3: Verify user exists in Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId!);
    
    if (!user) {
      throw new Error('User not found in authentication system');
    }

    // Step 4: Check if role is already assigned (idempotency)
    const currentRole = user.publicMetadata.role as string;
    if (currentRole === sanitizedRole) {
      console.log(`ℹ️ Role already assigned to user ${userId}: ${sanitizedRole}`);
      return createSuccessResponse(
        { role: sanitizedRole },
        'Role already assigned',
        200
      );
    }

    // Step 5: Update user metadata in Clerk with validation
    await clerk.users.updateUserMetadata(userId!, {
      publicMetadata: {
        role: sanitizedRole,
        onboardingComplete: false, // Still in progress
        roleAssignedAt: new Date().toISOString(),
      },
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Role assigned to user ${userId}: ${sanitizedRole} (${duration}ms)`);

    return createSuccessResponse(
      { 
        role: sanitizedRole,
        onboardingComplete: false,
      },
      'Role assigned successfully',
      200
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Role assignment error (${duration}ms):`, error);
    return handleAPIError(error);
  }
}
