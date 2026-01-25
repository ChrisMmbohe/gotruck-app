/**
 * Image Upload API Route
 * Handles profile picture uploads to Cloudinary
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage/cloudinary-upload";
import { connectToDatabase } from "@/lib/db/mongodb";
import { UserProfile } from "@/lib/db/models/user.model";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const { url, publicId } = await uploadImage(file, 'gotruck/profiles');

    // Update user profile in database
    const { db } = await connectToDatabase();
    const users = db.collection<UserProfile>('users');

    await users.updateOne(
      { clerkId: userId },
      {
        $set: {
          imageUrl: url,
          updatedAt: new Date(),
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url,
        publicId,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
