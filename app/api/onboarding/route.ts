import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      role, 
      companyName, 
      phoneNumber, 
      country, 
      licenseNumber, 
      vehicleId 
    } = body;

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Build metadata object
    const metadata: any = {
      role,
      onboardingComplete: true,
    };

    if (companyName) metadata.companyName = companyName;
    if (phoneNumber) metadata.phoneNumber = phoneNumber;
    if (country) metadata.country = country;
    if (licenseNumber) metadata.licenseNumber = licenseNumber;
    if (vehicleId) metadata.vehicleId = vehicleId;

    // Update user metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: metadata,
    });

    console.log(`User ${userId} onboarding completed with role: ${role} and profile data:`, metadata);

    return NextResponse.json({ success: true, role, metadata });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user metadata' },
      { status: 500 }
    );
  }
}
