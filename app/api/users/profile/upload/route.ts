/**
 * Image Upload API Route
 * POST /api/users/profile/upload - Upload profile image to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserRepository } from '@/lib/db/models/User';
import { uploadImage, deleteImage } from '@/lib/storage/image-upload';

/**
 * POST /api/users/profile/upload
 * Upload profile picture
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const userRepo = new UserRepository(db);

    // Get current profile to delete old image
    const currentProfile = await userRepo.getByClerkId(userId);
    
    // Delete old image if exists
    if (currentProfile?.imagePublicId) {
      try {
        await deleteImage(currentProfile.imagePublicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue even if deletion fails
      }
    }

    // Upload new image
    const { url, publicId } = await uploadImage(file, `gotruck/profiles/${userId}`);

    // Update profile with new image
    const updatedProfile = await userRepo.update(userId, {
      imageUrl: url,
      imagePublicId: publicId,
    });

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url,
        publicId,
        profile: updatedProfile,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/profile/upload
 * Delete profile picture
 */
export async function DELETE(request: NextRequest) {
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

    const currentProfile = await userRepo.getByClerkId(userId);

    if (!currentProfile?.imagePublicId) {
      return NextResponse.json(
        { success: false, message: 'No profile image to delete' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteImage(currentProfile.imagePublicId);

    // Update profile
    const updatedProfile = await userRepo.update(userId, {
      imageUrl: undefined,
      imagePublicId: undefined,
    });

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
