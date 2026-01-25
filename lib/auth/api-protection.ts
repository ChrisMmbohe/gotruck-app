/**
 * API Route Protection Middleware for GoTruck EAC Platform
 * Provides role-based access control for API endpoints
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole, Permission } from './roles';
import { hasPermission, hasAPIScope, APIScope, canAccessResource, ResourceType, Action } from './access-control';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: UserRole;
    companyId?: string;
    email?: string;
  };
}

/**
 * API Error Response
 */
export function createErrorResponse(
  message: string,
  status: number,
  code?: string
) {
  return NextResponse.json(
    {
      error: {
        message,
        code: code || 'ERROR',
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * API Success Response
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Require Authentication
 * Ensures user is authenticated before accessing API route
 */
export async function requireAuth(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: createErrorResponse('Authentication required', 401, 'UNAUTHORIZED'),
      user: null,
    };
  }

  const user = await currentUser();
  
  if (!user) {
    return {
      error: createErrorResponse('User not found', 404, 'USER_NOT_FOUND'),
      user: null,
    };
  }

  const userRole = user.publicMetadata?.role as UserRole;
  const companyId = user.publicMetadata?.companyId as string;

  return {
    error: null,
    user: {
      id: userId,
      role: userRole,
      companyId,
      email: user.emailAddresses[0]?.emailAddress,
    },
  };
}

/**
 * Require Specific Role
 * Ensures user has one of the allowed roles
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
) {
  const { error, user } = await requireAuth(request);

  if (error) return { error, user: null };

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return {
      error: createErrorResponse(
        'Insufficient permissions',
        403,
        'FORBIDDEN'
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Require Specific Permission
 * Ensures user has the required permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
) {
  const { error, user } = await requireAuth(request);

  if (error) return { error, user: null };

  if (!hasPermission(user?.role, permission)) {
    return {
      error: createErrorResponse(
        `Permission required: ${permission}`,
        403,
        'FORBIDDEN'
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Require API Scope
 * Ensures user has the required API scope
 */
export async function requireAPIScope(
  request: NextRequest,
  scope: APIScope
) {
  const { error, user } = await requireAuth(request);

  if (error) return { error, user: null };

  if (!hasAPIScope(user?.role, scope)) {
    return {
      error: createErrorResponse(
        `API scope required: ${scope}`,
        403,
        'FORBIDDEN'
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Require Resource Access
 * Ensures user can perform action on resource type
 */
export async function requireResourceAccess(
  request: NextRequest,
  resource: ResourceType,
  action: Action
) {
  const { error, user } = await requireAuth(request);

  if (error) return { error, user: null };

  if (!canAccessResource(user?.role, resource, action)) {
    return {
      error: createErrorResponse(
        `Cannot ${action} ${resource}`,
        403,
        'FORBIDDEN'
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Require Admin Role
 * Shorthand for requiring admin access
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(request, [UserRole.ADMIN]);
}

/**
 * Rate Limiting Middleware
 * Basic rate limiting by IP and user
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Apply Rate Limit
 * Middleware to apply rate limiting
 */
export async function applyRateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  const { user } = await requireAuth(request);
  
  // Use user ID if authenticated, otherwise use headers
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
  const identifier = user?.id || ip;
  
  const { allowed, remaining, resetAt } = checkRateLimit(
    identifier,
    maxRequests,
    windowMs
  );

  if (!allowed) {
    return {
      error: NextResponse.json(
        {
          error: {
            message: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            resetAt: new Date(resetAt).toISOString(),
          },
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetAt).toISOString(),
            'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return {
    error: null,
    headers: {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(resetAt).toISOString(),
    },
  };
}

/**
 * Validate Request Body
 * Generic request body validation
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (body: unknown) => { success: boolean; data?: T; error?: string }
): Promise<{ error: NextResponse | null; data: T | null }> {
  try {
    const body = await request.json();
    const result = validator(body);

    if (!result.success) {
      return {
        error: createErrorResponse(
          result.error || 'Invalid request body',
          400,
          'VALIDATION_ERROR'
        ),
        data: null,
      };
    }

    return { error: null, data: result.data as T };
  } catch (error) {
    return {
      error: createErrorResponse('Invalid JSON body', 400, 'INVALID_JSON'),
      data: null,
    };
  }
}

/**
 * Audit Log
 * Log API access for compliance
 */
export async function auditLog(
  userId: string,
  action: string,
  resource: string,
  details?: Record<string, unknown>
) {
  // In production, this would write to a database or audit service
  console.log('[AUDIT]', {
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource,
    details,
  });
}

/**
 * withAuth HOF
 * Higher-order function to wrap API routes with authentication
 */
export function withAuth(
  handler: (request: NextRequest, user: NonNullable<Awaited<ReturnType<typeof requireAuth>>['user']>) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const { error, user } = await requireAuth(request);
    
    if (error) return error;
    if (!user) return createErrorResponse('Authentication failed', 401, 'UNAUTHORIZED');
    
    return handler(request, user);
  };
}

/**
 * withRole HOF
 * Higher-order function to wrap API routes with role check
 */
export function withRole(
  allowedRoles: UserRole[],
  handler: (request: NextRequest, user: NonNullable<Awaited<ReturnType<typeof requireAuth>>['user']>) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const { error, user } = await requireRole(request, allowedRoles);
    
    if (error) return error;
    if (!user) return createErrorResponse('Authorization failed', 403, 'FORBIDDEN');
    
    return handler(request, user);
  };
}

/**
 * withPermission HOF
 * Higher-order function to wrap API routes with permission check
 */
export function withPermission(
  permission: Permission,
  handler: (request: NextRequest, user: NonNullable<Awaited<ReturnType<typeof requireAuth>>['user']>) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const { error, user } = await requirePermission(request, permission);
    
    if (error) return error;
    if (!user) return createErrorResponse('Permission denied', 403, 'FORBIDDEN');
    
    return handler(request, user);
  };
}
