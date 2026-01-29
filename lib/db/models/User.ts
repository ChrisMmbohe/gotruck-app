/**
 * MongoDB User Profile Repository
 * Enhanced user model with comprehensive profile management
 */

import { Db, Collection, Document, ObjectId } from 'mongodb';
import {
  UserProfile as IUserProfile,
  UserRole,
  ProfileCompletion,
  UserDocument,
  CompanyInfo,
  ContactDetails,
  DriverInfo,
  UserPreferences,
  UserActivity,
  UserStatus,
  REQUIRED_FIELDS_BY_ROLE,
  calculateCompletion,
  UpdateUserProfileDTO
} from '@/types/user';

/**
 * MongoDB User Profile Document Interface
 */
export interface UserProfileDocument extends Document {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  imageUrl?: string;
  imagePublicId?: string;

  // Role & Status
  role: UserRole;
  status: {
    isActive: boolean;
    isVerified: boolean;
    isOnboardingComplete: boolean;
    isSuspended: boolean;
    suspensionReason?: string;
    suspendedAt?: Date;
    suspendedBy?: string;
  };

  // Company Information
  company?: {
    name: string;
    id?: string;
    registrationNumber?: string;
    taxId?: string;
    website?: string;
    industry?: string;
    size?: 'small' | 'medium' | 'large';
  };

  // Contact Details
  contact?: {
    phoneNumber: string;
    alternatePhone?: string;
    country: 'KE' | 'UG' | 'TZ' | 'RW' | 'BI' | 'SS';
    city: string;
    address: string;
    postalCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  // Driver Information
  driverInfo?: {
    licenseNumber: string;
    licenseExpiry: Date;
    licenseClass?: string;
    vehicleId?: string;
    vehicleType?: 'truck' | 'van' | 'pickup' | 'trailer';
    vehiclePlate?: string;
    yearsOfExperience?: number;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    currentStatus?: 'available' | 'on_trip' | 'off_duty' | 'maintenance';
  };

  // Documents & Verification
  documents: Array<{
    type: 'license' | 'registration' | 'insurance' | 'id' | 'passport' | 'tax_cert' | 'other';
    name: string;
    url: string;
    publicId?: string;
    uploadedAt: Date;
    verifiedAt?: Date;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  }>;

  // Profile Completion
  completion: {
    percentage: number;
    completedFields: string[];
    missingFields: string[];
    lastUpdated: Date;
  };

  // Payment & Billing
  stripeCustomerId?: string;
  paymentMethods: Array<{
    id: string;
    type: 'card' | 'mobile_money' | 'bank_transfer';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }>;

  // Preferences
  preferences: {
    language: 'en' | 'sw' | 'fr';
    currency: 'KES' | 'UGX' | 'TZS';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      shipmentUpdates: boolean;
      promotions: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    timezone?: string;
  };

  // Activity Tracking
  activity: {
    lastLoginAt?: Date;
    loginCount: number;
    lastActiveAt?: Date;
    totalShipments?: number;
    totalRevenue?: number;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Create indexes for User collection
 */
export async function createUserIndexes(db: Db): Promise<void> {
  const users = db.collection<UserProfileDocument>('users');

  await users.createIndexes([
    { key: { clerkId: 1 }, unique: true },
    { key: { email: 1 }, unique: true },
    { key: { role: 1 } },
    { key: { 'company.id': 1 } },
    { key: { 'status.isVerified': 1 } },
    { key: { 'status.isOnboardingComplete': 1 } },
    { key: { 'status.isActive': 1 } },
    { key: { 'completion.percentage': 1 } },
    { key: { createdAt: -1 } },
    { key: { 'activity.lastLoginAt': -1 } },
    // Text search index
    { key: { firstName: 'text', lastName: 'text', 'company.name': 'text', email: 'text' } },
  ]);

  console.log('✅ User indexes created successfully');
}

/**
 * User Repository Class
 */
export class UserRepository {
  private collection: Collection<UserProfileDocument>;

  constructor(db: Db) {
    this.collection = db.collection<UserProfileDocument>('users');
  }

  /**
   * Get user by Clerk ID
   */
  async getByClerkId(clerkId: string): Promise<IUserProfile | null> {
    const user = await this.collection.findOne({ clerkId });
    return user ? this.mapToUserProfile(user) : null;
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<IUserProfile | null> {
    const user = await this.collection.findOne({ email });
    return user ? this.mapToUserProfile(user) : null;
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<IUserProfile | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    return user ? this.mapToUserProfile(user) : null;
  }

  /**
   * Create new user
   */
  async create(userData: Partial<UserProfileDocument>): Promise<IUserProfile> {
    const now = new Date();
    const role = userData.role || 'shipper';
    
    const defaultUser: Partial<UserProfileDocument> = {
      ...userData,
      role,
      status: {
        isActive: true,
        isVerified: false,
        isOnboardingComplete: false,
        isSuspended: false,
      },
      documents: [],
      completion: {
        percentage: 0,
        completedFields: [],
        missingFields: REQUIRED_FIELDS_BY_ROLE[role],
        lastUpdated: now,
      },
      paymentMethods: [],
      preferences: {
        language: 'en',
        currency: 'KES',
        notifications: {
          email: true,
          sms: true,
          push: true,
          shipmentUpdates: true,
          promotions: false,
        },
        theme: 'system',
      },
      activity: {
        loginCount: 0,
        totalShipments: 0,
        totalRevenue: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(defaultUser as UserProfileDocument);
    const created = await this.collection.findOne({ _id: result.insertedId });
    
    if (!created) throw new Error('Failed to create user');
    return this.mapToUserProfile(created);
  }

  /**
   * Update user profile
   */
  async update(clerkId: string, updates: UpdateUserProfileDTO): Promise<IUserProfile | null> {
    const updateDoc: any = {
      updatedAt: new Date(),
    };

    // Map updates to MongoDB document structure
    if (updates.firstName !== undefined) updateDoc.firstName = updates.firstName;
    if (updates.lastName !== undefined) updateDoc.lastName = updates.lastName;
    if (updates.displayName !== undefined) updateDoc.displayName = updates.displayName;
    if (updates.imageUrl !== undefined) updateDoc.imageUrl = updates.imageUrl;
    if (updates.imagePublicId !== undefined) updateDoc.imagePublicId = updates.imagePublicId;
    
    if (updates.company) {
      Object.keys(updates.company).forEach(key => {
        updateDoc[`company.${key}`] = updates.company![key as keyof CompanyInfo];
      });
    }
    
    if (updates.contact) {
      Object.keys(updates.contact).forEach(key => {
        updateDoc[`contact.${key}`] = updates.contact![key as keyof ContactDetails];
      });
    }
    
    if (updates.driverInfo) {
      Object.keys(updates.driverInfo).forEach(key => {
        updateDoc[`driverInfo.${key}`] = updates.driverInfo![key as keyof DriverInfo];
      });
    }
    
    if (updates.preferences) {
      // Deep merge preferences to avoid replacing entire sub-objects
      function flattenObject(obj: any, prefix = ''): Record<string, any> {
        return Object.keys(obj).reduce((acc, key) => {
          const value = obj[key];
          const path = prefix ? `${prefix}.${key}` : key;
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, path));
          } else {
            acc[path] = value;
          }
          return acc;
        }, {} as Record<string, any>);
      }
      const flatPrefs = flattenObject(updates.preferences, 'preferences');
      Object.assign(updateDoc, flatPrefs);
    }

    const result = await this.collection.findOneAndUpdate(
      { clerkId },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    // Recalculate completion percentage
    const completion = calculateCompletion(result, result.role);
    await this.collection.updateOne(
      { clerkId },
      { $set: { completion } }
    );

    const updated = await this.collection.findOne({ clerkId });
    return updated ? this.mapToUserProfile(updated) : null;
  }

  /**
   * Update profile completion
   */
  async updateCompletion(clerkId: string): Promise<ProfileCompletion | null> {
    const user = await this.collection.findOne({ clerkId });
    if (!user) return null;

    const completion = calculateCompletion(user, user.role);
    
    await this.collection.updateOne(
      { clerkId },
      { $set: { completion, updatedAt: new Date() } }
    );

    return completion;
  }

  /**
   * Add document
   */
  async addDocument(clerkId: string, document: UserDocument): Promise<boolean> {
    const result = await this.collection.updateOne(
      { clerkId },
      { 
        $push: { documents: document as any },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount > 0) {
      await this.updateCompletion(clerkId);
    }

    return result.modifiedCount > 0;
  }

  /**
   * Update document status
   */
  async updateDocumentStatus(
    clerkId: string,
    documentUrl: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<boolean> {
    const updateData: any = {
      'documents.$.status': status,
      'documents.$.verifiedAt': status === 'approved' ? new Date() : undefined,
      updatedAt: new Date(),
    };

    if (rejectionReason) {
      updateData['documents.$.rejectionReason'] = rejectionReason;
    }

    const result = await this.collection.updateOne(
      { clerkId, 'documents.url': documentUrl },
      { $set: updateData }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Delete document
   */
  async deleteDocument(clerkId: string, documentUrl: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { clerkId },
      { 
        $pull: { documents: { url: documentUrl } as any },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount > 0) {
      await this.updateCompletion(clerkId);
    }

    return result.modifiedCount > 0;
  }

  /**
   * Update activity
   */
  async updateActivity(clerkId: string, activity: Partial<UserActivity>): Promise<boolean> {
    const updateData: any = { updatedAt: new Date() };
    
    Object.keys(activity).forEach(key => {
      updateData[`activity.${key}`] = activity[key as keyof UserActivity];
    });

    const result = await this.collection.updateOne(
      { clerkId },
      { $set: updateData }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Record login
   */
  async recordLogin(clerkId: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { clerkId },
      {
        $inc: { 'activity.loginCount': 1 },
        $set: {
          'activity.lastLoginAt': new Date(),
          'activity.lastActiveAt': new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Soft delete user
   */
  async softDelete(clerkId: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { clerkId },
      {
        $set: {
          'status.isActive': false,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  }

  /**
   * Map MongoDB document to UserProfile interface
   */
  private mapToUserProfile(doc: UserProfileDocument): IUserProfile {
    return {
      id: doc._id!.toString(),
      clerkId: doc.clerkId,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      displayName: doc.displayName,
      imageUrl: doc.imageUrl,
      imagePublicId: doc.imagePublicId,
      role: doc.role,
      status: doc.status,
      company: doc.company,
      contact: doc.contact,
      driverInfo: doc.driverInfo,
      documents: doc.documents || [],
      completion: doc.completion,
      stripeCustomerId: doc.stripeCustomerId,
      paymentMethods: doc.paymentMethods || [],
      preferences: doc.preferences,
      activity: doc.activity,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
    };
  }
}

/**
 * Get default user profile for creation
 */
export function getDefaultUserProfile(
  clerkId: string,
  email: string,
  role: UserRole
): Partial<UserProfileDocument> {
  const now = new Date();
  
  return {
    clerkId,
    email,
    role,
    status: {
      isActive: true,
      isVerified: false,
      isOnboardingComplete: false,
      isSuspended: false,
    },
    documents: [],
    completion: {
      percentage: 0,
      completedFields: [],
      missingFields: REQUIRED_FIELDS_BY_ROLE[role],
      lastUpdated: now,
    },
    paymentMethods: [],
    preferences: {
      language: 'en',
      currency: 'KES',
      notifications: {
        email: true,
        sms: true,
        push: true,
        shipmentUpdates: true,
        promotions: false,
      },
      theme: 'system',
    },
    activity: {
      loginCount: 0,
      totalShipments: 0,
      totalRevenue: 0,
    },
    createdAt: now,
    updatedAt: now,
  };
}
