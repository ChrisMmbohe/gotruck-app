/**
 * Pagination utility for GoTruck EAC Freight Logistics Platform
 *
 * - Supports offset/limit and cursor-based pagination for REST APIs
 * - Use paginationQuerySchema for validating query params
 * - Use buildOffsetPaginationResult for response formatting
 */
// Supports offset/limit and cursor-based pagination for REST APIs
// Provides helpers for query param parsing, response formatting, and type safety

import { z } from 'zod';

// Zod schema for validating pagination query params
export const paginationQuerySchema = z.object({
  page: z.string().optional(), // 1-based page number (for offset pagination)
  limit: z.string().optional(), // items per page
  cursor: z.string().optional(), // for cursor-based pagination
  sort: z.string().optional(), // sort field (optional)
  order: z.enum(['asc', 'desc']).optional(), // sort order
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Default pagination settings
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Helper to parse and normalize pagination params
export function parsePagination(query: PaginationQuery) {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  let limit = Number(query.limit) || DEFAULT_LIMIT;
  limit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const cursor = query.cursor || null;
  const sort = query.sort || undefined;
  const order = query.order || 'asc';
  return { page, limit, cursor, sort, order };
}

// Offset pagination result type
export interface OffsetPaginationResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Cursor pagination result type
export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  limit: number;
}

// Helper to build offset pagination response
export function buildOffsetPaginationResult<T>(data: T[], total: number, page: number, limit: number): OffsetPaginationResult<T> {
  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// Helper to build cursor pagination response
export function buildCursorPaginationResult<T>(data: T[], limit: number, nextCursor: string | null): CursorPaginationResult<T> {
  return {
    data,
    nextCursor,
    limit,
  };
}
