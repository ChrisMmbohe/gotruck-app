import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from './response-handler';

/**
 * API error handler utility
 *
 * - Maps known error types to status codes and user-friendly messages
 * - Extend errorMap for custom error types
 * - Use with apiResponse for consistent error format
 */
const errorMap: Record<string, { status: number; message: string }> = {
  'ZodError': { status: 400, message: 'Invalid input data.' },
  'NotFoundError': { status: 404, message: 'Resource not found.' },
  'UnauthorizedError': { status: 401, message: 'Unauthorized.' },
  'ForbiddenError': { status: 403, message: 'Forbidden.' },
  // Add more as needed
};

export function apiError(error: any) {
  const type = error?.name || 'InternalServerError';
  const mapped = errorMap[type] || { status: 500, message: 'Internal Server Error' };
  return NextResponse.json(
    apiResponse({
      error: mapped.message,
      status: mapped.status,
      meta: {},
    }),
    { status: mapped.status }
  );
}