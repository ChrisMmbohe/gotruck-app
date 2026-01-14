import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Update user metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        role,
        onboardingComplete: true,
      },
    });

    console.log(`User ${userId} onboarding completed with role: ${role}`);

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user metadata' },
      { status: 500 }
    );
  }
}
