# GoTruck Access Control System

## Overview

The GoTruck EAC Freight Logistics Platform implements a comprehensive, multi-layered role-based access control (RBAC) system inspired by industry leaders like Stripe, Vercel, and AWS Console. This system provides fine-grained control over who can access what features, pages, and data.

## Table of Contents

1. [Access Control Layers](#access-control-layers)
2. [User Roles](#user-roles)
3. [Permission System](#permission-system)
4. [Feature Flags](#feature-flags)
5. [Resource-Level Access](#resource-level-access)
6. [Implementation Guide](#implementation-guide)
7. [API Protection](#api-protection)
8. [Best Practices](#best-practices)

---

## Access Control Layers

The system implements **4 layers** of access control:

### 1. **Route-Level Protection** (Middleware)
- Controls which pages users can navigate to
- Implemented in `middleware.ts`
- Redirects unauthorized users automatically

### 2. **Page-Level Protection** (Component Wrapper)
- Wraps entire pages with authentication checks
- Uses `DashboardPage` component
- Provides consistent UX for access denial

### 3. **Feature-Level Protection** (Conditional Rendering)
- Shows/hides specific features within pages
- Uses `Can`, `CanAccessFeature` components
- Fine-grained UI control

### 4. **API-Level Protection** (Route Handlers)
- Secures backend API endpoints
- Uses middleware functions from `api-protection.ts`
- Includes rate limiting and audit logging

---

## User Roles

### 🚚 Driver
**Primary Function:** Transport goods and update delivery status

**Access:**
- ✅ View assigned shipments
- ✅ Update GPS location
- ✅ View tracking information
- ✅ Upload delivery documents
- ✅ Personal settings
- ❌ Create shipments
- ❌ View fleet management
- ❌ Access analytics

**Default Landing:** `/dashboard/tracking`

### 📦 Shipper
**Primary Function:** Create and manage shipments

**Access:**
- ✅ All driver permissions
- ✅ Create/edit shipments
- ✅ View fleet (read-only)
- ✅ Assign drivers
- ✅ View basic analytics
- ✅ Generate invoices
- ✅ Export data
- ❌ Manage fleet
- ❌ Manage users
- ❌ Advanced analytics

**Default Landing:** `/dashboard`

### 👑 Admin
**Primary Function:** Full platform management

**Access:**
- ✅ All shipper permissions
- ✅ Manage fleet
- ✅ Manage users and roles
- ✅ Advanced analytics
- ✅ System settings
- ✅ Audit logs
- ✅ API access
- ✅ Bulk operations

**Default Landing:** `/dashboard/analytics`

---

## Permission System

### Available Permissions

```typescript
// Dashboard
VIEW_DASHBOARD         // All roles
VIEW_TRACKING          // All roles
VIEW_FLEET             // Shipper, Admin
MANAGE_FLEET           // Admin only

// Shipments
CREATE_SHIPMENT        // Shipper, Admin
VIEW_SHIPMENT          // All roles
EDIT_SHIPMENT          // Shipper, Admin
DELETE_SHIPMENT        // Admin only
ASSIGN_DRIVER          // Shipper, Admin

// Financial
VIEW_INVOICES          // Shipper, Admin
CREATE_INVOICE         // Admin only
VIEW_PAYMENTS          // Shipper, Admin
PROCESS_PAYMENT        // Admin only

// Analytics
VIEW_ANALYTICS         // Shipper, Admin
VIEW_ADVANCED_ANALYTICS // Admin only

// User Management
MANAGE_USERS           // Admin only
VIEW_DRIVERS           // Shipper, Admin

// Settings
VIEW_SETTINGS          // All roles
MANAGE_SETTINGS        // Admin only
```

### Using Permissions in Code

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Check single permission
  if (hasPermission('CREATE_SHIPMENT')) {
    // Show create button
  }

  // Check multiple permissions (any)
  if (hasAnyPermission(['VIEW_INVOICES', 'VIEW_PAYMENTS'])) {
    // Show financial section
  }

  // Check multiple permissions (all)
  if (hasAllPermissions(['MANAGE_FLEET', 'MANAGE_USERS'])) {
    // Show admin panel
  }
}
```

---

## Feature Flags

Feature flags enable/disable entire features based on role:

### Available Features

```typescript
REAL_TIME_TRACKING      // Driver, Shipper, Admin
ROUTE_OPTIMIZATION      // Shipper, Admin
ADVANCED_ANALYTICS      // Admin only
MULTI_CURRENCY          // Shipper, Admin
CUSTOMS_AUTOMATION      // Shipper, Admin
FLEET_MANAGEMENT        // Admin only
INVOICE_GENERATION      // Shipper, Admin
API_ACCESS              // Admin only
BULK_OPERATIONS         // Admin only
EXPORT_DATA             // Shipper, Admin
AUDIT_LOGS              // Admin only
TEAM_MANAGEMENT         // Admin only
```

### Using Feature Flags

```tsx
import { CanAccessFeature } from '@/components/auth/AccessControl';
import { Feature } from '@/lib/auth/access-control';

function AdvancedFeatures() {
  return (
    <CanAccessFeature 
      feature={Feature.ROUTE_OPTIMIZATION}
      showUpgrade={true}
    >
      <RouteOptimizerTool />
    </CanAccessFeature>
  );
}
```

---

## Resource-Level Access

Control CRUD operations on specific resource types:

### Resource Types & Actions

```typescript
enum ResourceType {
  SHIPMENT, VEHICLE, DRIVER, INVOICE, 
  ROUTE, DOCUMENT, ANALYTICS, SETTINGS
}

enum Action {
  CREATE, READ, UPDATE, DELETE, 
  LIST, EXPORT, SHARE
}
```

### Usage Example

```typescript
import { canAccessResource, ResourceType, Action } from '@/lib/auth/access-control';

// Check if user can create shipments
if (canAccessResource(userRole, ResourceType.SHIPMENT, Action.CREATE)) {
  // Show create form
}

// Check if user can delete vehicles
if (canAccessResource(userRole, ResourceType.VEHICLE, Action.DELETE)) {
  // Show delete button
}
```

---

## Implementation Guide

### 1. Protecting a Page

```tsx
// app/(root)/[locale]/dashboard/fleet/page.tsx
import { DashboardPage } from '@/components/auth/DashboardPage';

export default function FleetPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_FLEET"
      title="Fleet Management"
      description="Manage your vehicle fleet"
      showBackButton={true}
    >
      <FleetContent />
    </DashboardPage>
  );
}
```

### 2. Conditional Feature Rendering

```tsx
import { Can, ShowForRole } from '@/components/auth/AccessControl';

function ShipmentActions({ shipment }) {
  return (
    <div className="flex gap-2">
      <Can permission="EDIT_SHIPMENT">
        <Button onClick={() => editShipment(shipment.id)}>
          Edit
        </Button>
      </Can>

      <ShowForRole roles={['admin']}>
        <Button 
          variant="destructive"
          onClick={() => deleteShipment(shipment.id)}
        >
          Delete
        </Button>
      </ShowForRole>
    </div>
  );
}
```

### 3. Disabling Elements

```tsx
import { DisableIf } from '@/components/auth/AccessControl';

function ShipmentForm() {
  return (
    <form>
      <Input name="origin" />
      <Input name="destination" />
      
      <DisableIf 
        permission="ASSIGN_DRIVER"
        reason="Only shippers can assign drivers"
      >
        <Select name="driver">
          <option>Select driver...</option>
        </Select>
      </DisableIf>
    </form>
  );
}
```

### 4. Role-Based Content

```tsx
import { RoleBasedDashboard } from '@/components/auth/DashboardPage';

export default function DashboardPage() {
  return (
    <RoleBasedDashboard
      driver={<DriverDashboard />}
      shipper={<ShipperDashboard />}
      admin={<AdminDashboard />}
      fallback={<DefaultDashboard />}
    />
  );
}
```

---

## API Protection

### Basic Authentication

```typescript
import { requireAuth, createSuccessResponse } from '@/lib/auth/api-protection';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth(request);
  
  if (error) return error;
  
  return createSuccessResponse({ data: 'Protected data' });
}
```

### Role-Based Protection

```typescript
import { withRole } from '@/lib/auth/api-protection';
import { UserRole } from '@/lib/auth/roles';

export const POST = withRole(
  [UserRole.SHIPPER, UserRole.ADMIN],
  async (request, user) => {
    // Only shippers and admins reach here
    const body = await request.json();
    
    return createSuccessResponse({ 
      message: 'Shipment created',
      data: body 
    });
  }
);
```

### Permission-Based Protection

```typescript
import { requirePermission } from '@/lib/auth/api-protection';

export async function DELETE(request: NextRequest) {
  const { error, user } = await requirePermission(
    request, 
    'DELETE_SHIPMENT'
  );
  
  if (error) return error;
  
  // Proceed with deletion
  return createSuccessResponse({ message: 'Deleted' });
}
```

### Resource Access Control

```typescript
import { requireResourceAccess } from '@/lib/auth/api-protection';
import { ResourceType, Action } from '@/lib/auth/access-control';

export async function PUT(request: NextRequest) {
  const { error, user } = await requireResourceAccess(
    request,
    ResourceType.VEHICLE,
    Action.UPDATE
  );
  
  if (error) return error;
  
  // User can update vehicles
  return createSuccessResponse({ message: 'Updated' });
}
```

### Rate Limiting

```typescript
import { applyRateLimit } from '@/lib/auth/api-protection';

export async function POST(request: NextRequest) {
  // Limit to 20 requests per minute
  const rateLimitResult = await applyRateLimit(request, 20, 60000);
  
  if (rateLimitResult.error) {
    return rateLimitResult.error;
  }
  
  // Continue with request
}
```

### Audit Logging

```typescript
import { auditLog } from '@/lib/auth/api-protection';

export async function POST(request: NextRequest, user) {
  // Log the action
  await auditLog(
    user.id,
    'CREATE_SHIPMENT',
    'shipments',
    { trackingNumber: 'SHP123' }
  );
  
  // Continue...
}
```

---

## Best Practices

### ✅ DO

1. **Always use the highest appropriate layer**
   - Use middleware for route protection
   - Use page wrappers for page-level checks
   - Use components for feature-level checks

2. **Implement defense in depth**
   - Protect at multiple layers
   - Never rely on UI hiding alone
   - Always validate on the backend

3. **Use descriptive permission names**
   - `CREATE_SHIPMENT` ✅
   - `SHIPMENT_CREATE` ❌

4. **Provide clear feedback**
   - Show why access was denied
   - Offer alternative actions
   - Use `showUpgrade` for features

5. **Filter data by company**
   - Users should only see their company's data
   - Admins see all in their company
   - Implement in API queries

6. **Log sensitive actions**
   - Use audit logging for compliance
   - Track who did what and when
   - Store logs securely

### ❌ DON'T

1. **Don't rely on client-side checks alone**
   - Always validate on server
   - UI hiding is not security

2. **Don't hardcode roles in components**
   - Use permission system
   - Easier to maintain and extend

3. **Don't expose sensitive data in errors**
   - Generic error messages
   - Log details server-side

4. **Don't skip rate limiting**
   - Prevents abuse
   - Protects resources

5. **Don't forget to test**
   - Test each role thoroughly
   - Verify access denial works
   - Check edge cases

---

## Testing Access Control

### Manual Testing Checklist

For each role (Driver, Shipper, Admin):

- [ ] Can access allowed pages
- [ ] Cannot access restricted pages
- [ ] See appropriate navigation items
- [ ] Features show/hide correctly
- [ ] Buttons enable/disable properly
- [ ] API endpoints respect permissions
- [ ] Rate limits work correctly
- [ ] Audit logs capture actions

### Test User Accounts

Create test users for each role:

```typescript
// Driver
email: driver@test.com
role: driver

// Shipper
email: shipper@test.com
role: shipper

// Admin
email: admin@test.com
role: admin
```

---

## File Structure

```
lib/auth/
├── roles.ts                 # Role & permission definitions
├── access-control.ts        # Feature flags & resource access
└── api-protection.ts        # API middleware & helpers

components/auth/
├── ProtectedRoute.tsx       # Route-level wrapper
├── RoleGate.tsx            # Component-level gate
├── DashboardPage.tsx       # Page-level wrapper
└── AccessControl.tsx       # Feature-level components

hooks/
└── use-permissions.ts      # Permission hooks

middleware.ts               # Route protection
```

---

## Quick Reference

### Component Imports

```typescript
// Page wrapper
import { DashboardPage } from '@/components/auth/DashboardPage';

// Feature controls
import { 
  Can, 
  CanAccessFeature, 
  DisableIf, 
  ShowForRole,
  AccessDenied 
} from '@/components/auth/AccessControl';

// Hooks
import { usePermissions } from '@/hooks/use-permissions';

// API protection
import {
  requireAuth,
  requireRole,
  requirePermission,
  withAuth,
  withRole,
  withPermission,
  applyRateLimit,
  auditLog,
} from '@/lib/auth/api-protection';

// Access control utilities
import {
  hasPermission,
  canAccessFeature,
  canAccessResource,
  Feature,
  ResourceType,
  Action,
} from '@/lib/auth/access-control';
```

---

## Support

For questions or issues with access control:

1. Check this documentation
2. Review implementation examples
3. Test with different roles
4. Check middleware and API logs
5. Contact the development team

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
