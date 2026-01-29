/**
 * Standardized API response wrapper for analytics-ready data
 *
 * - Always use this for API responses to ensure consistency
 * - Extend ApiResponseMeta for additional metadata (e.g., pagination)
 * - Use with error-handler for unified error format
 */
export interface ApiResponseMeta {
  status: number;
  timestamp: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: ApiResponseMeta;
}

export function apiResponse<T>({
  data = null,
  error = null,
  status = 200,
  meta = {},
}: {
  data?: T | null;
  error?: string | null;
  status?: number;
  meta?: Record<string, any>;
}): ApiResponse<T> {
  return {
    success: !error,
    data: error ? null : data,
    error,
    meta: {
      status,
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}