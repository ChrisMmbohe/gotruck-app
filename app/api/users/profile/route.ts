/**
 * User Profile API Routes
 * GET /api/users/profile - Get current user's profile
 * PATCH /api/users/profile - Update user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserRepository } from '@/lib/db/models/User';
import { UpdateUserProfileDTO } from '@/types/user';
import { z } from 'zod';
import { customerSchema } from '@/lib/validation/schemas';
import { translateError } from '@/lib/validation/i18n-errors';
import { sanitizeDeep } from '@/lib/validation/sanitize';
import { ZodError } from 'zod';

/**
 * GET /api/users/profile
 * Fetch current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const userRepo = new UserRepository(db);

    const profile = await userRepo.getByClerkId(userId);

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Record activity
    await userRepo.updateActivity(userId, {
      lastActiveAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }


    const body: UpdateUserProfileDTO = await request.json();
    // Validate and sanitize with Zod
    const result = customerSchema.partial().safeParse(body);
    if (!result.success) {
      const locale = 'fr';
      const firstErr = result.error.errors[0];
      const translated = translateError(firstErr.message, locale);
      return NextResponse.json(
        { success: false, message: translated },
        { status: 400 }
      );
    }
    const cleanData = result.data;

    const { db } = await connectToDatabase();
    const userRepo = new UserRepository(db);

    // Update profile
    const updatedProfile = await userRepo.update(userId, body);

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: updatedProfile,
        completion: updatedProfile.completion,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
