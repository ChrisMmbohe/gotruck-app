/**
 * Quick Reference: Validation & Data Integrity
 * Use this as a cheat sheet for implementing validation in API routes
 * 
 * NOTE: This is a documentation file with code examples.
 * These examples show usage patterns and are not meant to be executed directly.
 */

/*
// ============================================
// 1. BASIC API ROUTE WITH VALIDATION
// ============================================

import { NextRequest } from 'next/server';
import { authAndValidate, createSuccessResponse, handleAPIError } from '@/lib/validation';
import { userProfileSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    // Validate auth + request body in one call
    const { error, userId, data } = await authAndValidate(req, userProfileSchema);
    if (error) return error;

    // Your business logic here
    const result = await processData(data);

    return createSuccessResponse(result, 'Operation successful');
  } catch (error) {
    return handleAPIError(error);
  }
}

// ============================================
// 2. ROLE-BASED API ROUTE
// ============================================

import { authRoleAndValidate } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const { error, userId, role, data } = await authRoleAndValidate(
      req,
      ['admin', 'shipper'], // Allowed roles
      userProfileSchema
    );
    if (error) return error;

    // Only admins and shippers can access this
    const result = await processDataByRole(data, role);

    return createSuccessResponse(result);
  } catch (error) {
    return handleAPIError(error);
  }
}

// ============================================
// 3. DATABASE OPERATIONS WITH VALIDATION
// ============================================

import { connectToDatabase } from '@/lib/db/mongodb';
import { 
  validateEmailUnique, 
  validateMongoUpdate,
  calculateProfileCompletion 
} from '@/lib/validation';

async function exampleDatabaseOperations() {
  const { db } = await connectToDatabase();
  const emailToCheck = "test@example.com";
  const userIdToExclude = "user_123";

  // Check uniqueness
  const isUnique = await validateEmailUnique(emailToCheck, db, userIdToExclude);
  if (!isUnique) {
    return handleDuplicateError('email');
  }

  // Validate update operations
  const safeUpdate = validateMongoUpdate({
    $set: { field: "value" }
  });

  // Calculate profile completion
  const userData = { firstName: "John", lastName: "Doe" };
  const completion = calculateProfileCompletion(userData, 'driver');
  console.log(`Profile ${completion.percentage}% complete`);
}

// ============================================
// 4. TRANSACTIONS (Atomic Operations)
// ============================================

import { withTransaction } from '@/lib/db/transactions';

async function exampleTransaction() {
  const { db } = await connectToDatabase();
  const result = await withTransaction(db, async (session) => {
    // All operations succeed or all fail
    await db.collection('users').insertOne(userData, { session });
    await db.collection('logs').insertOne(logData, { session });
    return { success: true };
  });
}

*/

// Export type to satisfy TypeScript
export type ValidationQuickReferenceGuide = string;

// ============================================
// 5. RETRY LOGIC FOR TRANSIENT ERRORS
// ============================================

import { withRetry } from '@/lib/db/transactions';

const result = await withRetry(
  async () => {
    return await someUnreliableOperation();
  },
  3, // max retries
  1000 // delay in ms
);

// ============================================
// 6. CUSTOM VALIDATION SCHEMA
// ============================================

import { z } from 'zod';

export const myCustomSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  age: z.number().int().min(18).max(120),
  role: z.enum(['user', 'admin']),
  metadata: z.object({
    key: z.string(),
  }).optional(),
});

export type MyCustomData = z.infer<typeof myCustomSchema>;

// ============================================
// 7. MANUAL VALIDATION
// ============================================

import { validateData } from '@/lib/validation';

const result = validateData(mySchema, userData);

if (!result.success) {
  console.error('Validation errors:', result.errors);
  return createErrorResponse(
    'Validation failed',
    ErrorCode.VALIDATION_ERROR,
    400,
    { errors: result.errors }
  );
}

const validatedData = result.data;

// ============================================
// 8. SANITIZATION
// ============================================

import { 
  sanitizeString, 
  sanitizeEmail, 
  sanitizePhone,
  sanitizeObject 
} from '@/lib/validation';

const safeName = sanitizeString(userInput);
const safeEmail = sanitizeEmail(emailInput);
const safePhone = sanitizePhone(phoneInput);
const safeObject = sanitizeObject(complexObject);

// ============================================
// 9. ERROR RESPONSES
// ============================================

import { 
  createErrorResponse,
  handleAuthError,
  handleNotFoundError,
  handleDuplicateError,
  ErrorCode 
} from '@/lib/validation';

// Custom error
return createErrorResponse(
  'Something went wrong',
  ErrorCode.INTERNAL_ERROR,
  500,
  { details: 'optional details' }
);

// Pre-built errors
return handleAuthError('Please log in');
return handleNotFoundError('User');
return handleDuplicateError('email');

// ============================================
// 10. SOFT DELETE
// ============================================

import { softDelete, restoreSoftDeleted } from '@/lib/db/transactions';

// Mark as deleted
await softDelete(db, 'users', { clerkId: userId });

// Restore
await restoreSoftDeleted(db, 'users', { clerkId: userId });

// ============================================
// 11. BATCH OPERATIONS
// ============================================

import { batchInsert, batchUpdate } from '@/lib/db/transactions';

// Batch insert with validation
const result = await batchInsert(
  db,
  'users',
  documents,
  {
    validateEach: (doc) => doc.email && doc.name,
  }
);

console.log(`Inserted: ${result.insertedCount}, Errors: ${result.errors.length}`);

// Batch update
const updateResult = await batchUpdate(
  db,
  'users',
  [
    { filter: { _id: id1 }, update: { $set: { status: 'active' } } },
    { filter: { _id: id2 }, update: { $set: { status: 'active' } } },
  ]
);

// ============================================
// 12. OPTIMISTIC LOCKING
// ============================================

import { optimisticUpdate } from '@/lib/db/transactions';

const result = await optimisticUpdate(
  db,
  'users',
  { clerkId: userId },
  (currentDoc) => ({
    balance: currentDoc.balance + 100,
    // Update based on current state
  }),
  3 // max retries
);

if (!result.success) {
  console.error('Failed to update:', result.error);
}

// ============================================
// 13. MIDDLEWARE ONLY (No Validation)
// ============================================

import { requireAuth, requireRole } from '@/lib/validation';

// Just auth
const { error, userId } = await requireAuth(req);
if (error) return error;

// Auth + role check
const { error, userId, role } = await requireRole(req, ['admin']);
if (error) return error;

// ============================================
// 14. RATE LIMITING
// ============================================

import { rateLimit, handleRateLimitError } from '@/lib/validation';

const { allowed, retryAfter } = rateLimit(
  userId || ipAddress,
  10, // max requests
  60000 // per minute
);

if (!allowed) {
  return handleRateLimitError(retryAfter);
}

// ============================================
// 15. LOGGING
// ============================================

import { logAPIRequest, logAPIResponse } from '@/lib/validation';

logAPIRequest('POST', '/api/users', userId, { action: 'create' });
logAPIResponse('POST', '/api/users', 200, 150, userId);

// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Simple CRUD with validation
export async function POST(req: NextRequest) {
  try {
    const { error, userId, data } = await authAndValidate(req, schema);
    if (error) return error;

    const { db } = await connectToDatabase();
    await db.collection('items').insertOne({ ...data, userId });

    return createSuccessResponse({ id: result.insertedId });
  } catch (error) {
    return handleAPIError(error);
  }
}

// Pattern 2: Update with uniqueness check
export async function PATCH(req: NextRequest) {
  try {
    const { error, userId, data } = await authAndValidate(req, schema);
    if (error) return error;

    const { db } = await connectToDatabase();

    // Check uniqueness
    if (data.email) {
      const isUnique = await validateEmailUnique(data.email, db, userId);
      if (!isUnique) return handleDuplicateError('email');
    }

    // Update
    await db.collection('users').updateOne(
      { clerkId: userId },
      { $set: data }
    );

    return createSuccessResponse({ updated: true });
  } catch (error) {
    return handleAPIError(error);
  }
}

// Pattern 3: Role-based access with transaction
export async function POST(req: NextRequest) {
  try {
    const { error, userId, role, data } = await authRoleAndValidate(
      req,
      ['admin'],
      schema
    );
    if (error) return error;

    const { db } = await connectToDatabase();

    const result = await withTransaction(db, async (session) => {
      // Multiple atomic operations
      await db.collection('items').insertOne(data, { session });
      await db.collection('logs').insertOne({ action: 'create', userId }, { session });
      return { success: true };
    });

    return createSuccessResponse(result);
  } catch (error) {
    return handleAPIError(error);
  }
}

// ============================================
// VALIDATION SCHEMAS EXAMPLES
// ============================================

// Re-use existing schemas
import { 
  userProfileSchema,
  onboardingCompleteSchema,
  roleAssignmentSchema 
} from '@/lib/validation/schemas';

// Extend existing schemas
const extendedUserSchema = userProfileSchema.extend({
  customField: z.string().optional(),
});

// Partial schema (all fields optional)
const partialUpdateSchema = userProfileSchema.partial();

// Pick specific fields
const loginSchema = userProfileSchema.pick({
  email: true,
});

// Omit fields
const publicProfileSchema = userProfileSchema.omit({
  password: true,
  stripeCustomerId: true,
});
