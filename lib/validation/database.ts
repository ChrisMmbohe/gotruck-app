/**
 * Database Validation Utilities
 * Critical validation layer for all database operations
 */

import { z } from "zod";
import { sanitizeObject, sanitizeMongoQuery } from "./sanitize";

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validate data against a Zod schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const sanitized = sanitizeObject(data as any);
    const validated = schema.parse(sanitized);
    
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
    
    return {
      success: false,
      errors: ['Validation failed: Unknown error'],
    };
  }
}

/**
 * Validate data with custom error messages
 */
export async function validateDataAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    const sanitized = sanitizeObject(data as any);
    const validated = await schema.parseAsync(sanitized);
    
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
    
    return {
      success: false,
      errors: ['Validation failed: Unknown error'],
    };
  }
}

/**
 * Validate MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validate Clerk User ID format
 */
export function isValidClerkId(id: string): boolean {
  return typeof id === 'string' && id.startsWith('user_') && id.length > 10;
}

/**
 * Sanitize and validate MongoDB query
 */
export function validateMongoQuery(query: any): any {
  if (!query || typeof query !== 'object') {
    throw new Error('Invalid query: must be an object');
  }
  
  // Sanitize the query to prevent NoSQL injection
  const sanitized = sanitizeMongoQuery(query);
  
  // Additional validation for specific fields
  if (sanitized.clerkId && !isValidClerkId(sanitized.clerkId)) {
    throw new Error('Invalid Clerk ID format');
  }
  
  if (sanitized._id && !isValidObjectId(sanitized._id)) {
    throw new Error('Invalid MongoDB ObjectId format');
  }
  
  return sanitized;
}

/**
 * Validate update operations for MongoDB
 */
export function validateMongoUpdate(update: any): any {
  if (!update || typeof update !== 'object') {
    throw new Error('Invalid update: must be an object');
  }
  
  // Ensure update uses proper MongoDB operators
  const validOperators = [
    '$set', 
    '$unset', 
    '$inc', 
    '$push', 
    '$pull', 
    '$addToSet',
    '$setOnInsert', // For upsert operations
    '$currentDate',
    '$min',
    '$max',
    '$mul',
    '$rename',
    '$pop',
    '$pullAll',
  ];
  const operators = Object.keys(update).filter(key => key.startsWith('$'));
  
  if (operators.length === 0) {
    // If no operators, wrap in $set
    return { $set: sanitizeObject(update) };
  }
  
  // Validate operators
  for (const op of operators) {
    if (!validOperators.includes(op)) {
      throw new Error(`Invalid MongoDB operator: ${op}`);
    }
  }
  
  // Sanitize each operator's data
  const sanitized: any = {};
  for (const key in update) {
    if (key.startsWith('$')) {
      sanitized[key] = sanitizeObject(update[key]);
    }
  }
  
  return sanitized;
}

/**
 * Validate required fields are present
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult<Record<string, any>> {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    return {
      success: false,
      errors: missing.map(field => `Missing required field: ${field}`),
    };
  }
  
  return {
    success: true,
    data,
  };
}

/**
 * Validate email uniqueness (helper for API routes)
 */
export async function validateEmailUnique(
  email: string,
  db: any,
  excludeUserId?: string
): Promise<boolean> {
  const query: any = { email: email.toLowerCase() };
  if (excludeUserId) {
    query.clerkId = { $ne: excludeUserId };
  }
  
  const existingUser = await db.collection('users').findOne(query);
  return !existingUser;
}

/**
 * Validate phone uniqueness (helper for API routes)
 */
export async function validatePhoneUnique(
  phone: string,
  db: any,
  excludeUserId?: string
): Promise<boolean> {
  const query: any = { phoneNumber: phone };
  if (excludeUserId) {
    query.clerkId = { $ne: excludeUserId };
  }
  
  const existingUser = await db.collection('users').findOne(query);
  return !existingUser;
}

/**
 * Validate license uniqueness for drivers
 */
export async function validateLicenseUnique(
  licenseNumber: string,
  db: any,
  excludeUserId?: string
): Promise<boolean> {
  const query: any = { 
    licenseNumber: licenseNumber.toUpperCase(),
    role: 'driver'
  };
  if (excludeUserId) {
    query.clerkId = { $ne: excludeUserId };
  }
  
  const existingDriver = await db.collection('users').findOne(query);
  return !existingDriver;
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(
  user: any,
  role: 'driver' | 'shipper' | 'admin'
): { percentage: number; missingFields: string[]; completedFields: string[] } {
  const baseFields = ['firstName', 'lastName', 'phoneNumber', 'country', 'city'];
  
  const roleSpecificFields: Record<string, string[]> = {
    driver: ['licenseNumber', 'licenseExpiry', 'vehicleType', 'vehiclePlate', 'emergencyContact'],
    shipper: ['companyName', 'address'],
    admin: [],
  };
  
  const requiredFields = [...baseFields, ...(roleSpecificFields[role] || [])];
  const totalFields = requiredFields.length;
  
  const completedFields: string[] = [];
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    const value = user[field];
    if (value !== undefined && value !== null && value !== '') {
      completedFields.push(field);
    } else {
      missingFields.push(field);
    }
  }
  
  const percentage = Math.round((completedFields.length / totalFields) * 100);
  
  return {
    percentage,
    missingFields,
    completedFields,
  };
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(date: Date, fieldName: string): ValidationResult<Date> {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today
  
  if (date < now) {
    return {
      success: false,
      errors: [`${fieldName} must be a future date`],
    };
  }
  
  return {
    success: true,
    data: date,
  };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date
): ValidationResult<{ startDate: Date; endDate: Date }> {
  if (startDate >= endDate) {
    return {
      success: false,
      errors: ['Start date must be before end date'],
    };
  }
  
  return {
    success: true,
    data: { startDate, endDate },
  };
}

/**
 * Batch validation - validate multiple schemas
 */
export function validateBatch<T extends Record<string, any>>(
  validations: Array<{ schema: z.ZodSchema<any>; data: unknown; name: string }>
): ValidationResult<T> {
  const errors: string[] = [];
  const results: any = {};
  
  for (const { schema, data, name } of validations) {
    const result = validateData(schema, data);
    if (!result.success) {
      errors.push(...(result.errors || []).map(err => `${name}: ${err}`));
    } else {
      results[name] = result.data;
    }
  }
  
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }
  
  return {
    success: true,
    data: results as T,
  };
}
