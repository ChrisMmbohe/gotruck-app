/**
 * Database Transaction Utilities
 * Support for atomic operations and data consistency
 */

import { Db, ClientSession } from 'mongodb';

/**
 * Execute database operations within a transaction
 * Ensures atomicity - all operations succeed or all fail
 */
export async function withTransaction<T>(
  db: Db,
  operations: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = db.client.startSession();
  
  try {
    session.startTransaction();
    
    const result = await operations(session);
    
    await session.commitTransaction();
    console.log('✅ Transaction committed successfully');
    
    return result;
  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Transaction aborted:', error);
    throw error;
  } finally {
    await session.endSession();
  }
}

/**
 * Retry logic for transient database errors
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on validation errors or client errors
      if (error.code === 11000 || // Duplicate key
          error.statusCode === 400 || // Bad request
          error.statusCode === 401 || // Unauthorized
          error.statusCode === 403) { // Forbidden
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.warn(`⚠️ Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`, error.message);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  console.error(`❌ Operation failed after ${maxRetries} attempts`);
  throw lastError;
}

/**
 * Batch insert with validation and error handling
 */
export async function batchInsert<T extends Record<string, any>>(
  db: Db,
  collectionName: string,
  documents: T[],
  options?: {
    ordered?: boolean;
    validateEach?: (doc: T) => boolean;
  }
): Promise<{ insertedCount: number; errors: any[] }> {
  const collection = db.collection(collectionName);
  const errors: any[] = [];
  
  // Validate each document if validator provided
  if (options?.validateEach) {
    const validDocs: T[] = [];
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      try {
        if (options.validateEach(doc)) {
          validDocs.push(doc);
        } else {
          errors.push({ index: i, error: 'Validation failed', document: doc });
        }
      } catch (error) {
        errors.push({ index: i, error, document: doc });
      }
    }
    documents = validDocs;
  }
  
  if (documents.length === 0) {
    return { insertedCount: 0, errors };
  }
  
  try {
    const result = await collection.insertMany(documents, {
      ordered: options?.ordered ?? false,
    });
    
    return {
      insertedCount: result.insertedCount,
      errors,
    };
  } catch (error: any) {
    // Handle bulk write errors
    if (error.code === 11000) {
      errors.push({ error: 'Duplicate key error', details: error });
    } else {
      errors.push({ error: error.message });
    }
    
    return {
      insertedCount: error.result?.insertedCount || 0,
      errors,
    };
  }
}

/**
 * Batch update with validation
 */
export async function batchUpdate(
  db: Db,
  collectionName: string,
  updates: Array<{ filter: any; update: any }>,
  options?: {
    upsert?: boolean;
  }
): Promise<{ modifiedCount: number; errors: any[] }> {
  const collection = db.collection(collectionName);
  const errors: any[] = [];
  let totalModified = 0;
  
  for (let i = 0; i < updates.length; i++) {
    const { filter, update } = updates[i];
    
    try {
      const result = await collection.updateOne(
        filter,
        update,
        { upsert: options?.upsert ?? false }
      );
      totalModified += result.modifiedCount;
    } catch (error: any) {
      errors.push({
        index: i,
        filter,
        error: error.message,
      });
    }
  }
  
  return {
    modifiedCount: totalModified,
    errors,
  };
}

/**
 * Atomic counter increment/decrement
 */
export async function updateCounter(
  db: Db,
  collectionName: string,
  filter: any,
  counterField: string,
  increment: number = 1
): Promise<number | null> {
  const collection = db.collection(collectionName);
  
  const result = await collection.findOneAndUpdate(
    filter,
    { $inc: { [counterField]: increment } },
    { returnDocument: 'after' }
  );
  
  return result ? result[counterField] : null;
}

/**
 * Optimistic locking for concurrent updates
 */
export async function optimisticUpdate<T extends Record<string, any>>(
  db: Db,
  collectionName: string,
  filter: any,
  update: (doc: T) => Partial<T>,
  maxRetries: number = 3
): Promise<{ success: boolean; document?: T; error?: string }> {
  const collection = db.collection(collectionName);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Fetch current document
    const currentDoc = await collection.findOne(filter) as T;
    
    if (!currentDoc) {
      return { success: false, error: 'Document not found' };
    }
    
    // Get current version (or create one)
    const currentVersion = (currentDoc as any).__version || 0;
    
    // Apply update function
    const updates = update(currentDoc);
    
    // Try to update with version check
    const result = await collection.findOneAndUpdate(
      {
        ...filter,
        __version: currentVersion,
      },
      {
        $set: {
          ...updates,
          __version: currentVersion + 1,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      return { success: true, document: result as T };
    }
    
    // Document was modified by another process, retry
    if (attempt < maxRetries) {
      console.warn(`⚠️ Optimistic lock conflict (attempt ${attempt}/${maxRetries}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, 100 * attempt));
    }
  }
  
  return { success: false, error: 'Failed after maximum retries due to concurrent updates' };
}

/**
 * Soft delete (mark as deleted instead of removing)
 */
export async function softDelete(
  db: Db,
  collectionName: string,
  filter: any
): Promise<{ deletedCount: number }> {
  const collection = db.collection(collectionName);
  
  const result = await collection.updateMany(
    {
      ...filter,
      deletedAt: { $exists: false },
    },
    {
      $set: {
        deletedAt: new Date(),
        isActive: false,
      },
    }
  );
  
  return { deletedCount: result.modifiedCount };
}

/**
 * Restore soft-deleted documents
 */
export async function restoreSoftDeleted(
  db: Db,
  collectionName: string,
  filter: any
): Promise<{ restoredCount: number }> {
  const collection = db.collection(collectionName);
  
  const result = await collection.updateMany(
    {
      ...filter,
      deletedAt: { $exists: true },
    },
    {
      $unset: { deletedAt: "" },
      $set: { isActive: true },
    }
  );
  
  return { restoredCount: result.modifiedCount };
}

/**
 * Ensure indexes exist for performance and uniqueness
 */
export async function ensureIndexes(db: Db): Promise<void> {
  const usersCollection = db.collection('users');
  
  // Create indexes
  await usersCollection.createIndex({ clerkId: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
  await usersCollection.createIndex({ licenseNumber: 1 }, { unique: true, sparse: true });
  await usersCollection.createIndex({ role: 1 });
  await usersCollection.createIndex({ isActive: 1 });
  await usersCollection.createIndex({ onboardingComplete: 1 });
  await usersCollection.createIndex({ createdAt: -1 });
  await usersCollection.createIndex({ deletedAt: 1 }, { sparse: true });
  
  console.log('✅ Database indexes created');
}

/**
 * Archive old deleted documents
 */
export async function archiveDeletedDocuments(
  db: Db,
  collectionName: string,
  daysOld: number = 90
): Promise<{ archivedCount: number }> {
  const collection = db.collection(collectionName);
  const archiveCollection = db.collection(`${collectionName}_archive`);
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  // Find documents to archive
  const documentsToArchive = await collection
    .find({
      deletedAt: { $lt: cutoffDate },
    })
    .toArray();
  
  if (documentsToArchive.length === 0) {
    return { archivedCount: 0 };
  }
  
  // Insert to archive collection
  await archiveCollection.insertMany(documentsToArchive);
  
  // Remove from main collection
  await collection.deleteMany({
    _id: { $in: documentsToArchive.map(doc => doc._id) },
  });
  
  console.log(`📦 Archived ${documentsToArchive.length} old documents from ${collectionName}`);
  
  return { archivedCount: documentsToArchive.length };
}
