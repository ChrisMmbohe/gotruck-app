/**
 * Error Handling Utilities
 * Standardized error responses and logging for API routes
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API error response format
 */
export interface APIError {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Standard API success response format
 */
export interface APISuccess<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Error codes for different types of failures
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  code: ErrorCode = ErrorCode.INTERNAL_ERROR,
  status: number = 500,
  details?: any
): NextResponse<APIError> {
  const response: APIError = {
    success: false,
    error,
    code,
    details: process.env.NODE_ENV === 'development' ? details : undefined,
    timestamp: new Date().toISOString(),
  };
  
  // Log error server-side
  console.error(`[API Error] ${code}: ${error}`, details);
  
  return NextResponse.json(response, { status });
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<APISuccess<T>> {
  const response: APISuccess<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<APIError> {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  
  return createErrorResponse(
    'Validation failed',
    ErrorCode.VALIDATION_ERROR,
    400,
    { validationErrors: errors }
  );
}

/**
 * Handle authentication errors
 */
export function handleAuthError(message: string = 'Authentication required'): NextResponse<APIError> {
  return createErrorResponse(
    message,
    ErrorCode.AUTHENTICATION_ERROR,
    401
  );
}

/**
 * Handle authorization errors
 */
export function handleAuthorizationError(message: string = 'Insufficient permissions'): NextResponse<APIError> {
  return createErrorResponse(
    message,
    ErrorCode.AUTHORIZATION_ERROR,
    403
  );
}

/**
 * Handle not found errors
 */
export function handleNotFoundError(resource: string = 'Resource'): NextResponse<APIError> {
  return createErrorResponse(
    `${resource} not found`,
    ErrorCode.NOT_FOUND,
    404
  );
}

/**
 * Handle duplicate entry errors
 */
export function handleDuplicateError(field: string): NextResponse<APIError> {
  return createErrorResponse(
    `${field} already exists`,
    ErrorCode.DUPLICATE_ENTRY,
    409,
    { field }
  );
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: any): NextResponse<APIError> {
  console.error('[Database Error]', error);
  
  // Don't expose internal database errors in production
  const message = process.env.NODE_ENV === 'development'
    ? error.message
    : 'Database operation failed';
  
  return createErrorResponse(
    message,
    ErrorCode.DATABASE_ERROR,
    500,
    process.env.NODE_ENV === 'development' ? error : undefined
  );
}

/**
 * Handle rate limit errors
 */
export function handleRateLimitError(retryAfter?: number): NextResponse<APIError> {
  const response = createErrorResponse(
    'Too many requests. Please try again later.',
    ErrorCode.RATE_LIMIT_EXCEEDED,
    429,
    retryAfter ? { retryAfter } : undefined
  );
  
  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }
  
  return response;
}

/**
 * Generic error handler for try-catch blocks
 */
export function handleAPIError(error: unknown): NextResponse<APIError> {
  // Zod validation error
  if (error instanceof ZodError) {
    return handleZodError(error);
  }
  
  // Standard Error object
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
      const field = extractFieldFromError(error.message);
      return handleDuplicateError(field);
    }
    
    if (error.message.includes('not found')) {
      return handleNotFoundError();
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      return handleAuthError(error.message);
    }
    
    if (error.message.includes('forbidden') || error.message.includes('permission')) {
      return handleAuthorizationError(error.message);
    }
    
    // Generic error
    return createErrorResponse(
      error.message,
      ErrorCode.INTERNAL_ERROR,
      500,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }
  
  // Unknown error type
  return createErrorResponse(
    'An unexpected error occurred',
    ErrorCode.INTERNAL_ERROR,
    500
  );
}

/**
 * Extract field name from MongoDB duplicate key error
 */
function extractFieldFromError(message: string): string {
  const match = message.match(/index: (\w+)/);
  return match ? match[1] : 'field';
}

/**
 * Validate request body exists
 */
export async function validateRequestBody(request: Request): Promise<any> {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      throw new Error('Request body must be a valid JSON object');
    }
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Log API request for monitoring
 */
export function logAPIRequest(
  method: string,
  path: string,
  userId?: string,
  details?: any
): void {
  const log = {
    timestamp: new Date().toISOString(),
    method,
    path,
    userId: userId || 'anonymous',
    ...details,
  };
  
  console.log('[API Request]', JSON.stringify(log));
}

/**
 * Log API response for monitoring
 */
export function logAPIResponse(
  method: string,
  path: string,
  status: number,
  duration: number,
  userId?: string
): void {
  const log = {
    timestamp: new Date().toISOString(),
    method,
    path,
    status,
    duration: `${duration}ms`,
    userId: userId || 'anonymous',
  };
  
  console.log('[API Response]', JSON.stringify(log));
}

/**
 * Wrap API handler with error handling and logging
 */
export function withErrorHandling(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = req.method;
    const path = new URL(req.url).pathname;
    
    try {
      logAPIRequest(method, path);
      const response = await handler(req);
      const duration = Date.now() - startTime;
      logAPIResponse(method, path, response.status, duration);
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[API Error] ${method} ${path} - ${duration}ms`, error);
      return handleAPIError(error);
    }
  };
}
