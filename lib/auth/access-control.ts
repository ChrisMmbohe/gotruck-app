/**
 * Comprehensive Access Control System for GoTruck EAC Platform
 * Inspired by top-tier applications: Stripe, Vercel, AWS Console
 */

import { UserRole, Permission, PERMISSIONS } from './roles';

/**
 * Feature flags for conditional access
 */
export enum Feature {
  REAL_TIME_TRACKING = 'real_time_tracking',
  ROUTE_OPTIMIZATION = 'route_optimization',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  MULTI_CURRENCY = 'multi_currency',
  CUSTOMS_AUTOMATION = 'customs_automation',
  FLEET_MANAGEMENT = 'fleet_management',
  INVOICE_GENERATION = 'invoice_generation',
  API_ACCESS = 'api_access',
  BULK_OPERATIONS = 'bulk_operations',
  EXPORT_DATA = 'export_data',
  AUDIT_LOGS = 'audit_logs',
  TEAM_MANAGEMENT = 'team_management',
}

/**
 * Feature access matrix by role
 */
export const FEATURE_ACCESS: Record<Feature, UserRole[]> = {
  [Feature.REAL_TIME_TRACKING]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.ROUTE_OPTIMIZATION]: [UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.ADVANCED_ANALYTICS]: [UserRole.ADMIN],
  [Feature.MULTI_CURRENCY]: [UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.CUSTOMS_AUTOMATION]: [UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.FLEET_MANAGEMENT]: [UserRole.ADMIN],
  [Feature.INVOICE_GENERATION]: [UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.API_ACCESS]: [UserRole.ADMIN],
  [Feature.BULK_OPERATIONS]: [UserRole.ADMIN],
  [Feature.EXPORT_DATA]: [UserRole.SHIPPER, UserRole.ADMIN],
  [Feature.AUDIT_LOGS]: [UserRole.ADMIN],
  [Feature.TEAM_MANAGEMENT]: [UserRole.ADMIN],
};

/**
 * Resource ownership and access control
 */
export enum ResourceType {
  SHIPMENT = 'shipment',
  VEHICLE = 'vehicle',
  DRIVER = 'driver',
  INVOICE = 'invoice',
  ROUTE = 'route',
  DOCUMENT = 'document',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings',
}

/**
 * Action types for resource access
 */
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  EXPORT = 'export',
  SHARE = 'share',
}

/**
 * Access control rules for resources
 * Format: [ResourceType][Action]: UserRole[]
 */
export const RESOURCE_ACCESS: Record<ResourceType, Record<Action, UserRole[]>> = {
  [ResourceType.SHIPMENT]: {
    [Action.CREATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.READ]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.SHARE]: [UserRole.SHIPPER, UserRole.ADMIN],
  },
  [ResourceType.VEHICLE]: {
    [Action.CREATE]: [UserRole.ADMIN],
    [Action.READ]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.ADMIN],
    [Action.SHARE]: [UserRole.ADMIN],
  },
  [ResourceType.DRIVER]: {
    [Action.CREATE]: [UserRole.ADMIN],
    [Action.READ]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.ADMIN],
    [Action.SHARE]: [UserRole.ADMIN],
  },
  [ResourceType.INVOICE]: {
    [Action.CREATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.READ]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.SHARE]: [UserRole.SHIPPER, UserRole.ADMIN],
  },
  [ResourceType.ROUTE]: {
    [Action.CREATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.READ]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.SHARE]: [UserRole.SHIPPER, UserRole.ADMIN],
  },
  [ResourceType.DOCUMENT]: {
    [Action.CREATE]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.READ]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.SHARE]: [UserRole.SHIPPER, UserRole.ADMIN],
  },
  [ResourceType.ANALYTICS]: {
    [Action.CREATE]: [UserRole.ADMIN],
    [Action.READ]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.ADMIN],
    [Action.SHARE]: [UserRole.ADMIN],
  },
  [ResourceType.SETTINGS]: {
    [Action.CREATE]: [UserRole.ADMIN],
    [Action.READ]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.UPDATE]: [UserRole.ADMIN],
    [Action.DELETE]: [UserRole.ADMIN],
    [Action.LIST]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
    [Action.EXPORT]: [UserRole.ADMIN],
    [Action.SHARE]: [UserRole.ADMIN],
  },
};

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
}

/**
 * Check if user can access a feature
 */
export function canAccessFeature(userRole: UserRole | undefined, feature: Feature): boolean {
  if (!userRole) return false;
  return FEATURE_ACCESS[feature]?.includes(userRole) || false;
}

/**
 * Check if user can perform action on resource
 */
export function canAccessResource(
  userRole: UserRole | undefined,
  resource: ResourceType,
  action: Action
): boolean {
  if (!userRole) return false;
  return RESOURCE_ACCESS[resource]?.[action]?.includes(userRole) || false;
}

/**
 * Check if user owns the resource (for data-level security)
 */
export function isResourceOwner(
  userId: string,
  resourceOwnerId: string,
  companyId?: string,
  resourceCompanyId?: string
): boolean {
  // Direct ownership
  if (userId === resourceOwnerId) return true;
  
  // Company-level access (same company can access)
  if (companyId && resourceCompanyId && companyId === resourceCompanyId) {
    return true;
  }
  
  return false;
}

/**
 * Get allowed actions for a user on a resource type
 */
export function getAllowedActions(
  userRole: UserRole | undefined,
  resource: ResourceType
): Action[] {
  if (!userRole) return [];
  
  return Object.entries(RESOURCE_ACCESS[resource])
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([action, _]) => action as Action);
}

/**
 * Get accessible features for a user role
 */
export function getAccessibleFeatures(userRole: UserRole | undefined): Feature[] {
  if (!userRole) return [];
  
  return Object.entries(FEATURE_ACCESS)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([feature, _]) => feature as Feature);
}

/**
 * Check if user can access dashboard section
 */
export function canAccessDashboardSection(
  userRole: UserRole | undefined,
  section: string
): boolean {
  if (!userRole) return false;
  
  const sectionPermissions: Record<string, Permission> = {
    'overview': 'VIEW_DASHBOARD',
    'tracking': 'VIEW_TRACKING',
    'fleet': 'VIEW_FLEET',
    'shipments': 'VIEW_SHIPMENT',
    'analytics': 'VIEW_ANALYTICS',
    'settings': 'VIEW_SETTINGS',
    'users': 'MANAGE_USERS',
  };
  
  const permission = sectionPermissions[section];
  return permission ? hasPermission(userRole, permission) : false;
}

/**
 * Filter resources based on user access
 */
export function filterAccessibleResources<T extends { id: string; ownerId?: string; companyId?: string }>(
  resources: T[],
  userRole: UserRole | undefined,
  userId: string,
  userCompanyId?: string,
  resourceType: ResourceType = ResourceType.SHIPMENT
): T[] {
  if (!userRole) return [];
  
  // Admins can see all resources in their company
  if (userRole === UserRole.ADMIN) {
    return resources.filter(r => 
      !r.companyId || r.companyId === userCompanyId
    );
  }
  
  // Check if user can list this resource type
  if (!canAccessResource(userRole, resourceType, Action.LIST)) {
    return [];
  }
  
  // Filter based on ownership and company
  return resources.filter(resource => {
    // User owns the resource
    if (resource.ownerId === userId) return true;
    
    // Same company access
    if (resource.companyId && resource.companyId === userCompanyId) {
      return true;
    }
    
    return false;
  });
}

/**
 * Scope definitions for API access
 */
export enum APIScope {
  READ_SHIPMENTS = 'read:shipments',
  WRITE_SHIPMENTS = 'write:shipments',
  READ_TRACKING = 'read:tracking',
  WRITE_TRACKING = 'write:tracking',
  READ_FLEET = 'read:fleet',
  WRITE_FLEET = 'write:fleet',
  READ_ANALYTICS = 'read:analytics',
  ADMIN_ACCESS = 'admin:*',
}

/**
 * API scope access matrix
 */
export const API_SCOPES: Record<APIScope, UserRole[]> = {
  [APIScope.READ_SHIPMENTS]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
  [APIScope.WRITE_SHIPMENTS]: [UserRole.SHIPPER, UserRole.ADMIN],
  [APIScope.READ_TRACKING]: [UserRole.DRIVER, UserRole.SHIPPER, UserRole.ADMIN],
  [APIScope.WRITE_TRACKING]: [UserRole.DRIVER, UserRole.ADMIN],
  [APIScope.READ_FLEET]: [UserRole.SHIPPER, UserRole.ADMIN],
  [APIScope.WRITE_FLEET]: [UserRole.ADMIN],
  [APIScope.READ_ANALYTICS]: [UserRole.SHIPPER, UserRole.ADMIN],
  [APIScope.ADMIN_ACCESS]: [UserRole.ADMIN],
};

/**
 * Check if user has API scope
 */
export function hasAPIScope(userRole: UserRole | undefined, scope: APIScope): boolean {
  if (!userRole) return false;
  return API_SCOPES[scope]?.includes(userRole) || false;
}
