/**
 * Dashboard Page Wrapper with Role-Based Access Control
 * Provides consistent access control for all dashboard pages
 */

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserRole, Permission } from '@/lib/auth/roles';
import { usePermissions } from '@/hooks/use-permissions';
import { AccessDenied } from './AccessControl';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface DashboardPageProps {
  children: ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  allowedRoles?: UserRole[];
  requireAll?: boolean;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

/**
 * DashboardPage Component
 * Wraps dashboard pages with authentication and authorization
 * 
 * @example
 * export default function FleetPage() {
 *   return (
 *     <DashboardPage 
 *       requiredPermission="VIEW_FLEET"
 *       title="Fleet Management"
 *     >
 *       <FleetContent />
 *     </DashboardPage>
 *   );
 * }
 */
export function DashboardPage({
  children,
  requiredPermission,
  requiredPermissions = [],
  allowedRoles,
  requireAll = false,
  title,
  description,
  showBackButton = false,
}: DashboardPageProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
  } = usePermissions();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <AccessDenied
        message="You must be signed in to access this page."
        action={
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        }
      />
    );
  }

  // Check role-based access
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return (
      <AccessDenied
        message="Your role does not have access to this page."
        action={
          <Button onClick={() => router.push('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        }
      />
    );
  }

  // Check permission-based access
  const hasAccess = requiredPermission
    ? hasPermission(requiredPermission)
    : requireAll
    ? hasAllPermissions(requiredPermissions)
    : requiredPermissions.length > 0
    ? hasAnyPermission(requiredPermissions)
    : true;

  if (!hasAccess) {
    return (
      <AccessDenied
        message="You don't have the required permissions to access this page."
        action={
          <div className="flex gap-3 justify-center">
            {showBackButton && (
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            )}
            <Button onClick={() => router.push('/dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        }
      />
    );
  }

  // Render page with optional header
  return (
    <div className="space-y-6">
      {(title || showBackButton) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {title && (
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * RoleBasedDashboard Component
 * Renders different content based on user role
 * 
 * @example
 * <RoleBasedDashboard
 *   driver={<DriverDashboard />}
 *   shipper={<ShipperDashboard />}
 *   admin={<AdminDashboard />}
 * />
 */
interface RoleBasedDashboardProps {
  driver?: ReactNode;
  shipper?: ReactNode;
  admin?: ReactNode;
  fallback?: ReactNode;
}

export function RoleBasedDashboard({
  driver,
  shipper,
  admin,
  fallback = null,
}: RoleBasedDashboardProps) {
  const { userRole } = usePermissions();

  switch (userRole) {
    case 'driver':
      return driver ? <>{driver}</> : <>{fallback}</>;
    case 'shipper':
      return shipper ? <>{shipper}</> : <>{fallback}</>;
    case 'admin':
      return admin ? <>{admin}</> : <>{fallback}</>;
    default:
      return <>{fallback}</>;
  }
}
