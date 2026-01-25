/**
 * Feature-Level Access Control Components
 * Granular UI components for conditional rendering based on permissions
 */

'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission, UserRole } from '@/lib/auth/roles';
import { Feature, canAccessFeature } from '@/lib/auth/access-control';
import { ShieldAlert } from 'lucide-react';

interface CanProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Can Component
 * Renders children only if user has required permission(s)
 * 
 * @example
 * <Can permission="CREATE_SHIPMENT">
 *   <CreateShipmentButton />
 * </Can>
 * 
 * @example
 * <Can permissions={["VIEW_ANALYTICS", "EXPORT_DATA"]} requireAll={false}>
 *   <AnalyticsExport />
 * </Can>
 */
export function Can({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null 
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const hasAccess = permission
    ? hasPermission(permission)
    : requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface CanAccessFeatureProps {
  children: ReactNode;
  feature: Feature;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

/**
 * CanAccessFeature Component
 * Renders children only if user's role has access to feature
 * 
 * @example
 * <CanAccessFeature feature={Feature.ROUTE_OPTIMIZATION}>
 *   <RouteOptimizer />
 * </CanAccessFeature>
 */
export function CanAccessFeature({ 
  children, 
  feature, 
  fallback = null,
  showUpgrade = false
}: CanAccessFeatureProps) {
  const { userRole } = usePermissions();

  const hasAccess = canAccessFeature(userRole, feature);

  if (!hasAccess && showUpgrade) {
    return (
      <div className="border border-amber-500/50 bg-amber-500/10 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="text-sm">
          This feature requires an upgrade. Contact admin to enable{' '}
          <strong>{feature.replace(/_/g, ' ').toLowerCase()}</strong>.
        </div>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface DisableIfProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  reason?: string;
}

/**
 * DisableIf Component
 * Disables child elements if user lacks permission
 * Useful for buttons, inputs, etc.
 * 
 * @example
 * <DisableIf permission="DELETE_SHIPMENT" reason="Only admins can delete">
 *   <Button>Delete</Button>
 * </DisableIf>
 */
export function DisableIf({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  reason 
}: DisableIfProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const hasAccess = permission
    ? hasPermission(permission)
    : requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Clone children and add disabled prop
  return (
    <div className="relative" title={reason}>
      <div className="opacity-50 pointer-events-none cursor-not-allowed">
        {children}
      </div>
    </div>
  );
}

interface ShowForRoleProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
}

/**
 * ShowForRole Component
 * Renders children only for specific roles
 * 
 * @example
 * <ShowForRole roles={[UserRole.ADMIN, UserRole.SHIPPER]}>
 *   <AdvancedSettings />
 * </ShowForRole>
 */
export function ShowForRole({ children, roles, fallback = null }: ShowForRoleProps) {
  const { hasAnyRole } = usePermissions();

  return hasAnyRole(roles) ? <>{children}</> : <>{fallback}</>;
}

interface AccessDeniedProps {
  message?: string;
  action?: ReactNode;
}

/**
 * AccessDenied Component
 * Standard access denied message
 */
export function AccessDenied({ 
  message = "You don't have permission to access this resource.",
  action
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
        {action && <div className="pt-4">{action}</div>}
      </div>
    </div>
  );
}

/**
 * useFeatureFlag Hook
 * Check if feature is enabled for user
 */
export function useFeatureFlag(feature: Feature): boolean {
  const { userRole } = usePermissions();
  return canAccessFeature(userRole, feature);
}

/**
 * useFeatureFlags Hook
 * Get all enabled features for user
 */
export function useFeatureFlags(): Feature[] {
  const { userRole } = usePermissions();
  
  if (!userRole) return [];
  
  return Object.keys(Feature)
    .map(key => Feature[key as keyof typeof Feature])
    .filter(feature => canAccessFeature(userRole, feature));
}
