/**
 * Data Sanitization Utilities
 * Remove dangerous characters and prevent injection attacks
 */

/**
 * Sanitize string input - remove HTML, scripts, and dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol
    .replace(/data:text\/html/gi, '')
    // Limit length to prevent DOS
    .slice(0, 10000);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/\s/g, '')
    .slice(0, 254); // RFC 5321
}

/**
 * Sanitize phone number - keep only digits, +, spaces, hyphens, parentheses
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return '';
  
  return phone
    .trim()
    .replace(/[^\d+\s()-]/g, '')
    .slice(0, 20);
}

/**
 * Sanitize alphanumeric input (e.g., license numbers, plate numbers)
 */
export function sanitizeAlphanumeric(input: string, allowSpaces = false): string {
  if (typeof input !== 'string') return '';
  
  const pattern = allowSpaces ? /[^A-Z0-9\s-]/g : /[^A-Z0-9-]/g;
  return input
    .toUpperCase()
    .trim()
    .replace(pattern, '')
    .slice(0, 50);
}

/**
 * Sanitize MongoDB query - prevent NoSQL injection
 */
export function sanitizeMongoQuery(query: any): any {
  if (query === null || query === undefined) return query;
  
  if (typeof query === 'string') {
    return sanitizeString(query);
  }
  
  if (typeof query === 'number' || typeof query === 'boolean') {
    return query;
  }
  
  if (Array.isArray(query)) {
    return query.map((item: any) => sanitizeMongoQuery(item));
  }
  
  if (typeof query === 'object') {
    const sanitized: any = {};
    for (const key in query) {
      // Skip prototype pollution attempts
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      // Remove MongoDB operators in user input (except in specific allowed contexts)
      if (key.startsWith('$')) {
        continue;
      }
      
      sanitized[key] = sanitizeMongoQuery(query[key]);
    }
    return sanitized;
  }
  
  return query;
}

/**
 * Sanitize object for database insertion
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      // Skip dangerous keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item: any) => 
          typeof item === 'object' ? sanitizeObject(item) : sanitizeString(String(item))
        );
      } else if (value !== null && typeof value === 'object' && !(value as any instanceof Date)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized as T;
}

/**
 * Validate and sanitize file upload data
 */
export function sanitizeFileData(file: {
  name: string;
  type: string;
  size: number;
  url: string;
}): { name: string; type: string; size: number; url: string } | null {
  // Allowed file types for document uploads
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  
  // Max file size: 5MB
  const maxSize = 5 * 1024 * 1024;
  
  if (!file.name || !file.type || !file.size || !file.url) {
    return null;
  }
  
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return null;
  }
  
  if (file.size > maxSize) {
    return null;
  }
  
  // Validate URL format
  try {
    new URL(file.url);
  } catch {
    return null;
  }
  
  return {
    name: sanitizeString(file.name).slice(0, 255),
    type: file.type.toLowerCase(),
    size: file.size,
    url: file.url,
  };
}

/**
 * Rate limiting key sanitization
 */
export function sanitizeRateLimitKey(key: string): string {
  return key
    .replace(/[^a-zA-Z0-9:_-]/g, '')
    .slice(0, 100);
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  
  return query
    .trim()
    .replace(/[^\w\s-]/g, '') // Keep only word chars, spaces, hyphens
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .slice(0, 200);
}
