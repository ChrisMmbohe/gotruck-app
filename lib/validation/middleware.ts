/**
 * API Middleware for Validation and Security
 * App-wide critical validation middleware
 */

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { validateData } from "./database";
import { handleAuthError, handleZodError, createErrorResponse, ErrorCode } from "./errors";

/**
 * Middleware: Require authentication
 */
export async function requireAuth(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      error: handleAuthError(),
      userId: null,
    };
  }
  
  return {
    error: null,
    userId,
  };
}

/**
 * Middleware: Require specific role
 */
export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      error: handleAuthError(),
      userId: null,
      role: null,
    };
  }
  
  // Get user metadata from Clerk
  const { clerkClient } = await import("@clerk/nextjs/server");
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const role = user.publicMetadata.role as string;
  
  if (!role || !allowedRoles.includes(role)) {
    return {
      error: createErrorResponse(
        'Insufficient permissions',
        ErrorCode.AUTHORIZATION_ERROR,
        403
      ),
      userId: null,
      role: null,
    };
  }
  
  return {
    error: null,
    userId,
    role,
  };
}

/**
 * Middleware: Validate request body with Zod schema
 */
export async function validateRequestBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{
  error: NextResponse | null;
  data: T | null;
}> {
  try {
    const body = await req.json();
    const result = validateData(schema, body);
    
    if (!result.success) {
      return {
        error: createErrorResponse(
          'Validation failed',
          ErrorCode.VALIDATION_ERROR,
          400,
          { errors: result.errors }
        ),
        data: null,
      };
    }
    
    return {
      error: null,
      data: result.data!,
    };
  } catch (error) {
    return {
      error: createErrorResponse(
        'Invalid JSON in request body',
        ErrorCode.INVALID_REQUEST,
        400
      ),
      data: null,
    };
  }
}

/**
 * Middleware: Rate limiting (basic implementation)
 * For production, use Redis-based rate limiting
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }
  
  if (record.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment count
  record.count++;
  return { allowed: true };
}

/**
 * Middleware: Content-Type validation
 */
export function validateContentType(req: NextRequest, expectedType: string = 'application/json'): {
  error: NextResponse | null;
} {
  const contentType = req.headers.get('content-type');
  
  if (!contentType || !contentType.includes(expectedType)) {
    return {
      error: createErrorResponse(
        `Content-Type must be ${expectedType}`,
        ErrorCode.INVALID_REQUEST,
        415
      ),
    };
  }
  
  return { error: null };
}

/**
 * Middleware: Request size limit (prevent DOS)
 */
export async function validateRequestSize(
  req: NextRequest,
  maxSizeBytes: number = 1048576 // 1MB default
): Promise<{ error: NextResponse | null }> {
  const contentLength = req.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > maxSizeBytes) {
    return {
      error: createErrorResponse(
        `Request body too large. Maximum size: ${maxSizeBytes} bytes`,
        ErrorCode.INVALID_REQUEST,
        413
      ),
    };
  }
  
  return { error: null };
}

/**
 * Combined middleware: Auth + Validation
 */
export async function authAndValidate<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{
  error: NextResponse | null;
  userId: string | null;
  data: T | null;
}> {
  // Check authentication
  const authResult = await requireAuth(req);
  if (authResult.error) {
    return {
      error: authResult.error,
      userId: null,
      data: null,
    };
  }
  
  // Validate request body
  const validationResult = await validateRequestBody(req, schema);
  if (validationResult.error) {
    return {
      error: validationResult.error,
      userId: authResult.userId,
      data: null,
    };
  }
  
  return {
    error: null,
    userId: authResult.userId!,
    data: validationResult.data!,
  };
}

/**
 * Combined middleware: Auth + Role + Validation
 */
export async function authRoleAndValidate<T>(
  req: NextRequest,
  allowedRoles: string[],
  schema: ZodSchema<T>
): Promise<{
  error: NextResponse | null;
  userId: string | null;
  role: string | null;
  data: T | null;
}> {
  // Check authentication and role
  const roleResult = await requireRole(req, allowedRoles);
  if (roleResult.error) {
    return {
      error: roleResult.error,
      userId: null,
      role: null,
      data: null,
    };
  }
  
  // Validate request body
  const validationResult = await validateRequestBody(req, schema);
  if (validationResult.error) {
    return {
      error: validationResult.error,
      userId: roleResult.userId,
      role: roleResult.role,
      data: null,
    };
  }
  
  return {
    error: null,
    userId: roleResult.userId!,
    role: roleResult.role!,
    data: validationResult.data!,
  };
}

/**
 * Middleware: CORS headers
 */
export function addCorsHeaders(response: NextResponse, allowedOrigins: string[] = []): NextResponse {
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

/**
 * Middleware: Security headers
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(self), microphone=()');
  
  return response;
}
