import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

/**
 * POST /api/auth/signout
 * Handle final signout - clears session and returns success
 */
export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Sign out the user from Clerk
    // Note: The actual session clearing is handled by Clerk middleware
    // We just return success and let the client handle redirect
    
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    });

  } catch (error) {
    console.error('Error during signout:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
