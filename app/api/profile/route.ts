/**
 * User Profile API - GET (Fetch Profile) & PUT (Update Profile)
 * Returns the current user's profile from MongoDB
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { UserProfile, calculateProfileCompletion } from "@/lib/db/models/user.model";
import { z } from "zod";

// Validation schema for profile updates
const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  alternatePhone: z.string().optional(),
  country: z.enum(['KE', 'UG', 'TZ', 'RW', 'BI', 'SS']).optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  companyName: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  vehicleType: z.string().optional(),
  vehiclePlate: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional(),
  preferences: z.object({
    language: z.enum(['en', 'sw', 'fr']).optional(),
    currency: z.enum(['KES', 'UGX', 'TZS']).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    }).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

export async function GET() {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection<UserProfile>('users');

    // Fetch user profile
    const user = await users.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Remove sensitive fields
    const { _id, ...userProfile } = user;

    return NextResponse.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid input",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection<UserProfile>('users');

    // Get current user
    const currentUser = await users.findOne({ clerkId: userId });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
      lastActiveAt: new Date(),
    };

    // Convert licenseExpiry string to Date if provided
    if (updates.licenseExpiry) {
      updateData.licenseExpiry = new Date(updates.licenseExpiry);
    }

    // Update user profile
    const result = await users.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Calculate profile completion
    const completion = calculateProfileCompletion(result);
    
    // Update completion fields
    await users.updateOne(
      { clerkId: userId },
      {
        $set: {
          profileCompletionPercentage: completion.percentage,
          requiredFieldsCompleted: completion.completed,
          missingFields: completion.missing,
        }
      }
    );

    // Get updated profile
    const updatedUser = await users.findOne({ clerkId: userId });
    const { _id, ...userProfile } = updatedUser!;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: userProfile,
      completion,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
