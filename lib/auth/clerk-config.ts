import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Clerk Configuration
 * Multi-tenant authentication setup for GoTruck EAC Platform
 */

export const clerkConfig = {
  // Authentication settings
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/onboarding',
  
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
    '/api/health',
    '/about',
    '/contact',
    '/pricing',
    '/features',
  ],
  
  // Routes that should be ignored by Clerk middleware
  ignoredRoutes: [
    '/api/webhooks(.*)',
    '/_next(.*)',
    '/static(.*)',
    '/favicon.ico',
    '/manifest.json',
    '/sw.js',
  ],
};

/**
 * Clerk appearance customization
 */
export const clerkAppearance = {
  elements: {
    formButtonPrimary: 
      'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
    card: 'shadow-lg',
    headerTitle: 'text-2xl font-bold',
    headerSubtitle: 'text-gray-600',
    socialButtonsBlockButton: 
      'border-gray-300 hover:bg-gray-50',
    formFieldLabel: 'text-sm font-medium text-gray-700',
    formFieldInput: 
      'rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    footerActionLink: 'text-blue-600 hover:text-blue-700',
  },
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
};

/**
 * Session configuration
 */
export const sessionConfig = {
  // Session token lifetime (30 days)
  maxAge: 30 * 24 * 60 * 60,
  
  // Cookie settings
  cookieName: '__session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
};

/**
 * OAuth provider configuration
 */
export const oauthProviders = {
  google: {
    enabled: true,
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  },
  apple: {
    enabled: true,
    clientId: process.env.OAUTH_APPLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_APPLE_CLIENT_SECRET,
  },
};

/**
 * Rate limiting configuration for authentication
 */
export const rateLimitConfig = {
  signIn: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  signUp: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

/**
 * Validation rules for user registration
 */
export const validationRules = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  phoneNumber: {
    // EAC country phone formats
    patterns: {
      KE: /^(\+254|0)[17]\d{8}$/, // Kenya
      UG: /^(\+256|0)[37]\d{8}$/, // Uganda
      TZ: /^(\+255|0)[67]\d{8}$/, // Tanzania
      RW: /^(\+250|0)[78]\d{8}$/, // Rwanda
      BI: /^(\+257|0)[67]\d{7}$/, // Burundi
      SS: /^(\+211|0)[19]\d{8}$/, // South Sudan
    },
  },
  companyName: {
    minLength: 2,
    maxLength: 100,
  },
};

/**
 * Email templates configuration
 */
export const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@gotruck.app',
  templates: {
    welcome: 'welcome-email',
    verification: 'email-verification',
    passwordReset: 'password-reset',
    roleAssignment: 'role-assignment',
  },
};

/**
 * Webhook event types to handle
 */
export const webhookEvents = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  SESSION_CREATED: 'session.created',
  SESSION_ENDED: 'session.ended',
  EMAIL_CREATED: 'email.created',
  SMS_CREATED: 'sms.created',
} as const;

export type WebhookEvent = typeof webhookEvents[keyof typeof webhookEvents];
