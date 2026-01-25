import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./routing";
import { UserRole, DEFAULT_REDIRECTS, PROTECTED_ROUTES } from "./lib/auth/roles";

/**
 * Check if user has access to route based on role
 */
function checkRouteAccess(path: string, userRole: UserRole): boolean {
  // Remove locale from path for checking
  const pathWithoutLocale = path.replace(/^\/(en|fr|sw)/, '');
  
  // Always allow access to settings and onboarding
  if (pathWithoutLocale.includes('/settings') || pathWithoutLocale.includes('/onboarding')) {
    return true;
  }
  
  // Check role-specific routes
  switch (userRole) {
    case UserRole.DRIVER:
      // Drivers can only access: tracking, shipments (view only), settings
      return (
        pathWithoutLocale.includes('/dashboard/tracking') ||
        pathWithoutLocale.includes('/dashboard/shipments') ||
        pathWithoutLocale === '/dashboard' // Allow base dashboard
      );
      
    case UserRole.SHIPPER:
      // Shippers can access: overview, tracking, fleet (view), shipments, analytics (basic), settings
      return (
        pathWithoutLocale === '/dashboard' ||
        pathWithoutLocale.includes('/dashboard/tracking') ||
        pathWithoutLocale.includes('/dashboard/fleet') ||
        pathWithoutLocale.includes('/dashboard/shipments') ||
        pathWithoutLocale.includes('/dashboard/analytics')
      );
      
    case UserRole.ADMIN:
      // Admins have full access
      return true;
      
    default:
      return false;
  }
}

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/pricing(.*)',
  '/api/webhooks(.*)',
  '/api/health',
  '/:locale',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/:locale/sso-callback(.*)',
  '/:locale/terms(.*)',
  '/:locale/privacy(.*)',
  '/:locale/about(.*)',
  '/:locale/contact(.*)',
  '/:locale/pricing(.*)',
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

  const metadata = publicMetadata || unsafeMetadata;

  // Check for onboarding completion bypass (just completed onboarding)
  const searchParams = req.nextUrl.searchParams;
  const justCompletedOnboarding = searchParams.get('onboarding') === 'complete';
  
  // Check for onboarding completion cookie (set after successful onboarding)
  const onboardingCompleteCookie = req.cookies.get('onboarding_complete')?.value === 'true';

  // Allow access to onboarding page itself
  if (path.includes('/onboarding')) {
    return intlMiddleware(req);
  }

  // Check if onboarding is complete for protected routes
  // Trust the cookie if it exists, otherwise check metadata
  const onboardingComplete = onboardingCompleteCookie || metadata?.onboardingComplete || justCompletedOnboarding;
  
  if (requiresOnboarding(req) && !onboardingComplete) {
    const locale = path.split('/')[1] || 'en';
    const onboardingUrl = new URL(`/${locale}/onboarding`, req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Role-based access control with improved redirects
  const userRole = metadata?.role as UserRole | undefined;

  // Granular route protection based on role
  if (userRole && requiresOnboarding(req)) {
    const hasAccess = checkRouteAccess(path, userRole);
    
    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      const locale = path.split('/')[1] || 'en';
      const defaultPath = DEFAULT_REDIRECTS[userRole];
      const redirectUrl = new URL(`/${locale}${defaultPath}`, req.url);
      
      // Add access denied parameter
      redirectUrl.searchParams.set('error', 'access_denied');
      
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  if (userRole && path.includes('/dashboard')) {
    const locale = path.split('/')[1] || 'en';
    const pathWithoutLocale = path.replace(`/${locale}`, '');
    
    // If user is accessing the root dashboard route, redirect to their role-specific portal
    if (pathWithoutLocale === '/dashboard') {
      const defaultPath = DEFAULT_REDIRECTS[userRole];
      const redirectUrl = new URL(`/${locale}${defaultPath}`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Check if user is accessing an unauthorized route
    let allowedRoutes: readonly string[] = [];
    
    switch (userRole) {
      case UserRole.DRIVER:
        allowedRoutes = PROTECTED_ROUTES.driver;
        break;
      case UserRole.SHIPPER:
        allowedRoutes = PROTECTED_ROUTES.shipper;
        break;
      case UserRole.ADMIN:
        allowedRoutes = PROTECTED_ROUTES.admin;
        break;
    }
    
    const isAllowed = allowedRoutes.some(allowedPath => 
      pathWithoutLocale === allowedPath || pathWithoutLocale.startsWith(`${allowedPath}/`)
    );
    
    if (!isAllowed) {
      // Redirect to role-specific default page
      const defaultPath = DEFAULT_REDIRECTS[userRole];
      const redirectUrl = new URL(`/${locale}${defaultPath}`, req.url);
      return NextResponse.redirect(redirectUrl);
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
