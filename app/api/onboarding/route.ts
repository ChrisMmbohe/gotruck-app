import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { translateError } from '@/lib/validation/i18n-errors';
import { sanitizeDeep } from '@/lib/validation/sanitize';
import { eacValidators } from '@/lib/validation/eac-validators';
import { ZodError } from 'zod';

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Zod schema for onboarding
    const onboardingSchema = z.object({
      role: z.string().min(2).transform(sanitizeDeep),
      companyName: z.string().min(2).optional().transform(sanitizeDeep),
      phoneNumber: eacValidators.phone.optional().transform(sanitizeDeep),
      country: z.string().min(2).optional().transform(sanitizeDeep),
      licenseNumber: z.string().min(2).optional().transform(sanitizeDeep),
      vehicleId: z.string().optional().transform(sanitizeDeep),
    });

    const body = await req.json();
    const result = onboardingSchema.safeParse(body);
    if (!result.success) {
      const locale = 'sw';
      const firstErr = result.error.errors[0];
      const translated = translateError(firstErr.message, locale);
      return NextResponse.json({ error: translated }, { status: 400 });
    }
    const { role, companyName, phoneNumber, country, licenseNumber, vehicleId } = result.data;

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
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => translateError(err.message, 'sw'));
      return NextResponse.json({ error: errors.join('; ') }, { status: 400 });
    }
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user metadata' },
      { status: 500 }
    );
  }
}
