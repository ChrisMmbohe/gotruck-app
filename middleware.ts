import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./routing";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/api/webhooks(.*)',
  '/api/health',
  '/:locale',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/terms(.*)',
  '/:locale/privacy(.*)',
]);

// Routes that require onboarding completion
const requiresOnboarding = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

// Combine Clerk and i18n middleware
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();
  const path = req.nextUrl.pathname;

  // Skip i18n middleware for API routes
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }

  // Always allow public routes (sign-in, sign-up, landing page)
  if (isPublicRoute(req)) {
    return intlMiddleware(req);
  }

  // Redirect unauthenticated users to sign-in
  if (!userId) {
    const locale = path.split('/')[1] || 'en';
    const signInUrl = new URL(`/${locale}/sign-in`, req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Get user metadata from session claims
  const unsafeMetadata = sessionClaims?.unsafeMetadata as {
    role?: string;
    onboardingComplete?: boolean;
  } | undefined;

  const publicMetadata = sessionClaims?.publicMetadata as {
    role?: string;
    onboardingComplete?: boolean;
  } | undefined;

  const metadata = unsafeMetadata || publicMetadata;

  // Check for onboarding completion bypass (just completed onboarding)
  const searchParams = req.nextUrl.searchParams;
  const onboardingComplete = searchParams.get('onboarding') === 'complete';

  // Check if onboarding is complete for protected routes
  if (requiresOnboarding(req) && !metadata?.onboardingComplete && !onboardingComplete) {
    // Allow access to onboarding page itself
    if (!path.includes('/onboarding')) {
      const locale = path.split('/')[1] || 'en';
      const onboardingUrl = new URL(`/${locale}/onboarding`, req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  // Role-based access control
  const userRole = metadata?.role;
  
  // Driver-specific restrictions
  if (userRole === 'driver') {
    const driverAllowedPaths = [
      '/dashboard/tracking',
      '/dashboard/shipments',
      '/dashboard/settings',
      '/onboarding',
    ];
    
    const isAllowed = driverAllowedPaths.some(allowedPath => 
      path.includes(allowedPath)
    );
    
    if (!isAllowed && path.includes('/dashboard')) {
      const locale = path.split('/')[1] || 'en';
      const defaultUrl = new URL(`/${locale}/dashboard/tracking`, req.url);
      return NextResponse.redirect(defaultUrl);
    }
  }

  // Continue with i18n middleware
  return intlMiddleware(req);
});

export const config = {
  // Match all pathnames except static files and _next
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
