# 🚀 GoTruck Access Control - Quick Reference

## 🎯 Import Cheatsheet

```typescript
// Page Protection
import { DashboardPage } from '@/components/auth/DashboardPage';

// Component Protection
import { 
  Can, 
  CanAccessFeature, 
  DisableIf, 
  ShowForRole,
  AccessDenied 
} from '@/components/auth/AccessControl';

// Hooks
import { usePermissions } from '@/hooks/use-permissions';

// API Protection
import {
  requireAuth,
  requireRole,
  requirePermission,
  requireResourceAccess,
  withAuth,
  withRole,
  withPermission,
  applyRateLimit,
  auditLog,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/auth/api-protection';

// Types & Utilities
import { UserRole, Permission } from '@/lib/auth/roles';
import { 
  Feature, 
  ResourceType, 
  Action,
  canAccessFeature,
  canAccessResource,
} from '@/lib/auth/access-control';
```

---

## 👥 Roles

```typescript
UserRole.DRIVER   // 🚚 Transport & delivery
UserRole.SHIPPER  // 📦 Shipment management
UserRole.ADMIN    // 👑 Full control
```

---

## 🔐 Common Permissions

```typescript
// Most Used
'VIEW_DASHBOARD'
'VIEW_SHIPMENT'
'CREATE_SHIPMENT'
'EDIT_SHIPMENT'
'DELETE_SHIPMENT'
'VIEW_FLEET'
'MANAGE_FLEET'
'VIEW_TRACKING'
'ASSIGN_DRIVER'
'VIEW_ANALYTICS'
'MANAGE_USERS'
```

---

## 📄 Page Protection Patterns

### Basic
```tsx
export default function Page() {
  return (
    <DashboardPage requiredPermission="VIEW_DASHBOARD">
      <Content />
    </DashboardPage>
  );
}
```

### With Multiple Permissions
```tsx
<DashboardPage
  requiredPermissions={["VIEW_FLEET", "MANAGE_FLEET"]}
  requireAll={false}  // OR logic
  title="Fleet Management"
>
  <Content />
</DashboardPage>
```

### With Allowed Roles
```tsx
<DashboardPage
  allowedRoles={[UserRole.ADMIN, UserRole.SHIPPER]}
  title="Advanced Analytics"
>
  <Content />
</DashboardPage>
```

---

## 🎨 Component Protection Patterns

### Show/Hide Based on Permission
```tsx
<Can permission="CREATE_SHIPMENT">
  <Button>New Shipment</Button>
</Can>
```

### Multiple Permissions (OR)
```tsx
<Can 
  permissions={["VIEW_INVOICES", "VIEW_PAYMENTS"]}
  requireAll={false}
>
  <FinancialSection />
</Can>
```

### Multiple Permissions (AND)
```tsx
<Can 
  permissions={["MANAGE_FLEET", "MANAGE_USERS"]}
  requireAll={true}
>
  <AdminPanel />
</Can>
```

### Show Fallback
```tsx
<Can 
  permission="VIEW_ANALYTICS"
  fallback={<UpgradePrompt />}
>
  <Analytics />
</Can>
```

### Role-Based Rendering
```tsx
<ShowForRole roles={['admin', 'shipper']}>
  <AdvancedFeatures />
</ShowForRole>
```

### Feature Flags
```tsx
<CanAccessFeature 
  feature={Feature.ROUTE_OPTIMIZATION}
  showUpgrade={true}
>
  <RouteOptimizer />
</CanAccessFeature>
```

### Disable Elements
```tsx
<DisableIf 
  permission="DELETE_SHIPMENT"
  reason="Only admins can delete"
>
  <Button variant="destructive">Delete</Button>
</DisableIf>
```

---

## 🪝 Hook Patterns

### Basic Usage
```tsx
function MyComponent() {
  const { 
    userRole, 
    hasPermission, 
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermissions();

  if (hasPermission('CREATE_SHIPMENT')) {
    // ...
  }
}
```

### Check Multiple Permissions
```tsx
const canManage = hasAnyPermission([
  'MANAGE_FLEET',
  'MANAGE_USERS',
]);
```

### Check Role
```tsx
if (hasRole('admin')) {
  // Admin-only logic
}

if (hasAnyRole(['admin', 'shipper'])) {
  // Admin or shipper logic
}
```

### Feature Flags
```tsx
import { useFeatureFlag } from '@/components/auth/AccessControl';

const hasOptimization = useFeatureFlag(Feature.ROUTE_OPTIMIZATION);
```

---

## 🔒 API Protection Patterns

### Basic Auth
```typescript
export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth(request);
  if (error) return error;
  
  return createSuccessResponse({ data: 'Protected' });
}
```

### Role Check
```typescript
export async function POST(request: NextRequest) {
  const { error, user } = await requireRole(
    request,
    [UserRole.ADMIN]
  );
  if (error) return error;
  
  return createSuccessResponse({ data: 'Created' });
}
```

### Permission Check
```typescript
export async function DELETE(request: NextRequest) {
  const { error, user } = await requirePermission(
    request,
    'DELETE_SHIPMENT'
  );
  if (error) return error;
  
  return createSuccessResponse({ message: 'Deleted' });
}
```

### Resource Access
```typescript
export async function PUT(request: NextRequest) {
  const { error, user } = await requireResourceAccess(
    request,
    ResourceType.VEHICLE,
    Action.UPDATE
  );
  if (error) return error;
  
  return createSuccessResponse({ message: 'Updated' });
}
```

### Using HOFs (Recommended)
```typescript
// With auth
export const GET = withAuth(async (request, user) => {
  return createSuccessResponse({ userId: user.id });
});

// With role
export const POST = withRole(
  [UserRole.ADMIN],
  async (request, user) => {
    return createSuccessResponse({ data: 'Created' });
  }
);

// With permission
export const DELETE = withPermission(
  'DELETE_SHIPMENT',
  async (request, user) => {
    return createSuccessResponse({ message: 'Deleted' });
  }
);
```

### Rate Limiting
```typescript
export async function POST(request: NextRequest) {
  // 100 requests per minute
  const rateLimit = await applyRateLimit(request, 100, 60000);
  if (rateLimit.error) return rateLimit.error;
  
  // Continue...
}
```

### Audit Log
```typescript
await auditLog(
  user.id,
  'CREATE_SHIPMENT',
  'shipments',
  { trackingNumber: 'SHP123' }
);
```

---

## 🎯 Common Scenarios

### Scenario 1: Create Button
```tsx
<Can permission="CREATE_SHIPMENT">
  <Button onClick={createShipment}>
    <Plus className="w-4 h-4 mr-2" />
    New Shipment
  </Button>
</Can>
```

### Scenario 2: Edit/Delete Actions
```tsx
<div className="flex gap-2">
  <Can permission="EDIT_SHIPMENT">
    <Button onClick={edit}>Edit</Button>
  </Can>
  
  <ShowForRole roles={['admin']}>
    <Button variant="destructive" onClick={del}>
      Delete
    </Button>
  </ShowForRole>
</div>
```

### Scenario 3: Admin Settings Tab
```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    
    <Can permission="MANAGE_SETTINGS">
      <TabsTrigger value="company">Company</TabsTrigger>
    </Can>
    
    <ShowForRole roles={['admin']}>
      <TabsTrigger value="team">Team</TabsTrigger>
      <TabsTrigger value="api">API Keys</TabsTrigger>
    </ShowForRole>
  </TabsList>
</Tabs>
```

### Scenario 4: Role-Based Dashboard
```tsx
import { RoleBasedDashboard } from '@/components/auth/DashboardPage';

<RoleBasedDashboard
  driver={<DriverDashboard />}
  shipper={<ShipperDashboard />}
  admin={<AdminDashboard />}
/>
```

### Scenario 5: Conditional Table Columns
```tsx
function ShipmentTable() {
  const { hasPermission } = usePermissions();
  
  return (
    <table>
      <thead>
        <tr>
          <th>Tracking #</th>
          <th>Status</th>
          {hasPermission('VIEW_ANALYTICS') && (
            <th>Revenue</th>
          )}
          {hasPermission('MANAGE_FLEET') && (
            <th>Actions</th>
          )}
        </tr>
      </thead>
    </table>
  );
}
```

---

## ⚡ Performance Tips

1. **Use HOFs for API routes** - Cleaner and more efficient
2. **Check permissions once** - Store result in variable
3. **Use ShowForRole for entire sections** - Avoid multiple checks
4. **Leverage middleware** - Catches unauthorized access early
5. **Cache permission results** - usePermissions hook is optimized

---

## 🚨 Common Mistakes

❌ **Don't do this:**
```tsx
// Multiple individual checks
<Can permission="A"><Button /></Can>
<Can permission="A"><Input /></Can>
<Can permission="A"><Select /></Can>
```

✅ **Do this instead:**
```tsx
// Wrap entire section
<Can permission="A">
  <Button />
  <Input />
  <Select />
</Can>
```

❌ **Don't do this:**
```tsx
// Hardcoded role check
if (user.role === 'admin') { ... }
```

✅ **Do this instead:**
```tsx
// Use hook
const { hasRole } = usePermissions();
if (hasRole('admin')) { ... }
```

---

## 📚 Full Documentation

- **[ACCESS_CONTROL_GUIDE.md](./ACCESS_CONTROL_GUIDE.md)** - Complete guide
- **[ACCESS_CONTROL_EXAMPLES.md](./ACCESS_CONTROL_EXAMPLES.md)** - Real examples
- **[ACCESS_CONTROL_SUMMARY.md](./ACCESS_CONTROL_SUMMARY.md)** - Overview

---

**Keep this reference handy while developing! 🚀**
