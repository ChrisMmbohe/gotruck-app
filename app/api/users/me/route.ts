import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/db/mongodb';

/**
 * GET /api/users/me
 * Fetch current authenticated user's details from database
 */
export async function GET() {
  try {
    // Get the current user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Fetch user from database
    const user = await db.collection('users').findOne({
      clerkId: clerkUser.id
    });

    if (!user) {
      // If user doesn't exist in DB yet, create from Clerk data
      const newUser = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || null,
        role: clerkUser.publicMetadata?.role || 'shipper',
        organizationId: clerkUser.publicMetadata?.organizationId || null,
        companyName: clerkUser.publicMetadata?.companyName || null,
        phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        preferences: {
          language: clerkUser.publicMetadata?.language || 'en',
          currency: clerkUser.publicMetadata?.currency || 'KES',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').insertOne(newUser);
      
      return NextResponse.json({
        id: newUser.clerkId,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        imageUrl: newUser.imageUrl,
        role: newUser.role,
        organizationId: newUser.organizationId,
        companyName: newUser.companyName,
        phoneNumber: newUser.phoneNumber,
        preferences: newUser.preferences,
      });
    }

    // Return user data (include preferences if present)
    return NextResponse.json({
      id: user.clerkId,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      organizationId: user.organizationId,
      companyName: user.companyName,
      phoneNumber: user.phoneNumber,
      preferences: user.preferences || { language: 'en', currency: 'KES' },
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}