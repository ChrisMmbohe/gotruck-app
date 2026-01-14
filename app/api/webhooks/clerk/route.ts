import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserRole } from '@/lib/auth/roles';

/**
 * Clerk Webhook Handler
 * Syncs user data between Clerk and MongoDB
 */

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new NextResponse('Error: Verification error', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      case 'session.created':
        await handleSessionCreated(evt.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return new NextResponse('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error(`Error processing webhook ${eventType}:`, error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

/**
 * Handle user creation
 */
async function handleUserCreated(data: any) {
  const { db } = await connectToDatabase();
  
  const userData = {
    clerkId: data.id,
    email: data.email_addresses[0]?.email_address,
    firstName: data.first_name,
    lastName: data.last_name,
    imageUrl: data.image_url,
    role: (data.public_metadata?.role as UserRole) || UserRole.SHIPPER,
    companyId: data.public_metadata?.companyId,
    companyName: data.public_metadata?.companyName,
    phoneNumber: data.public_metadata?.phoneNumber,
    country: data.public_metadata?.country,
    isVerified: false,
    onboardingComplete: false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };

  await db.collection('users').insertOne(userData);
  
  console.log('User created in MongoDB:', userData.clerkId);
}

/**
 * Handle user update
 */
async function handleUserUpdated(data: any) {
  const { db } = await connectToDatabase();
  
  const updateData = {
    email: data.email_addresses[0]?.email_address,
    firstName: data.first_name,
    lastName: data.last_name,
    imageUrl: data.image_url,
    role: data.public_metadata?.role,
    companyId: data.public_metadata?.companyId,
    companyName: data.public_metadata?.companyName,
    phoneNumber: data.public_metadata?.phoneNumber,
    country: data.public_metadata?.country,
    isVerified: data.public_metadata?.isVerified,
    onboardingComplete: data.public_metadata?.onboardingComplete,
    updatedAt: new Date(data.updated_at),
  };

  await db.collection('users').updateOne(
    { clerkId: data.id },
    { $set: updateData }
  );
  
  console.log('User updated in MongoDB:', data.id);
}

/**
 * Handle user deletion
 */
async function handleUserDeleted(data: any) {
  const { db } = await connectToDatabase();
  
  // Soft delete - mark as deleted instead of removing
  await db.collection('users').updateOne(
    { clerkId: data.id },
    { 
      $set: { 
        deletedAt: new Date(),
        isActive: false,
      } 
    }
  );
  
  console.log('User deleted in MongoDB:', data.id);
}

/**
 * Handle session creation
 */
async function handleSessionCreated(data: any) {
  const { db } = await connectToDatabase();
  
  // Update last login time
  await db.collection('users').updateOne(
    { clerkId: data.user_id },
    { 
      $set: { 
        lastLoginAt: new Date(),
      },
      $inc: {
        loginCount: 1,
      }
    }
  );
  
  console.log('Session created for user:', data.user_id);
}
