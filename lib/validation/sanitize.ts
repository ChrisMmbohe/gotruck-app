/**
 * Simple sanitization utility to prevent injection
 *
 * - Use sanitizeInput for single strings
 * - Use sanitizeDeep for objects/arrays (recursively)
 * - Integrate with Zod schemas for all user input
 */
export function sanitizeInput(input: string): string {
  // Remove dangerous characters and escape HTML
  return input
    .replace(/[<>'"`;/\\(){}]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Recursively sanitize all string fields in an object/array
export function sanitizeDeep<T>(data: T): T {
  if (typeof data === 'string') return sanitizeInput(data) as any;
  if (Array.isArray(data)) return data.map(sanitizeDeep) as any;
  if (typeof data === 'object' && data !== null) {
    const result: any = {};
    for (const key in data) {
      result[key] = sanitizeDeep((data as any)[key]);
    }
    return result;
  }
  return data;
}