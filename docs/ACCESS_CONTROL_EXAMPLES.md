# Access Control Implementation Examples

## Real-World Examples for GoTruck Dashboard

### Example 1: Enhanced Dashboard Page with Access Control

```tsx
// app/(root)/[locale]/dashboard/page.tsx
'use client';

import { DashboardPage } from '@/components/auth/DashboardPage';
import { Can, ShowForRole, CanAccessFeature } from '@/components/auth/AccessControl';
import { Feature } from '@/lib/auth/access-control';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, TrendingUp, Plus } from 'lucide-react';

export default function EnhancedDashboardPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_DASHBOARD"
      title="Dashboard Overview"
      description="Monitor your freight operations in real-time"
    >
      {/* Role-specific greeting */}
      <ShowForRole roles={['driver']}>
        <WelcomeDriver />
      </ShowForRole>

      <ShowForRole roles={['shipper', 'admin']}>
        <WelcomeShipper />
      </ShowForRole>

      {/* Stats Grid - Role-based visibility */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* All roles can see active shipments */}
        <StatCard
          title="Active Shipments"
          value="142"
          icon={<Package />}
          trend="+12%"
        />

        {/* Only shippers and admins see fleet stats */}
        <Can permission="VIEW_FLEET">
          <StatCard
            title="Fleet Vehicles"
            value="24"
            icon={<Truck />}
            trend="+2"
          />
        </Can>

        {/* Only admins see advanced analytics */}
        <Can permission="VIEW_ADVANCED_ANALYTICS">
          <StatCard
            title="Revenue Today"
            value="KES 4.2M"
            icon={<TrendingUp />}
            trend="+18%"
          />
        </Can>
      </div>

      {/* Quick Actions - Permission-based */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Can permission="CREATE_SHIPMENT">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Shipment
            </Button>
          </Can>

          <Can permission="ASSIGN_DRIVER">
            <Button variant="outline">Assign Driver</Button>
          </Can>

          <ShowForRole roles={['admin']}>
            <Button variant="outline">Manage Fleet</Button>
            <Button variant="outline">View Reports</Button>
          </ShowForRole>
        </CardContent>
      </Card>

      {/* Feature-gated components */}
      <CanAccessFeature 
        feature={Feature.ROUTE_OPTIMIZATION}
        showUpgrade={true}
      >
        <RouteOptimizationPanel />
      </CanAccessFeature>

      <CanAccessFeature feature={Feature.ADVANCED_ANALYTICS}>
        <AdvancedAnalyticsDashboard />
      </CanAccessFeature>
    </DashboardPage>
  );
}

function WelcomeDriver() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <h3 className="font-semibold">Welcome back, Driver! 👋</h3>
      <p className="text-sm text-muted-foreground">
        You have 3 deliveries scheduled for today.
      </p>
    </div>
  );
}

function WelcomeShipper() {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
      <h3 className="font-semibold">Welcome to your command center! 👋</h3>
      <p className="text-sm text-muted-foreground">
        All systems operational. 142 active shipments.
      </p>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <Badge variant="secondary" className="mt-2">
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

### Example 2: Shipments Page with Full Access Control

```tsx
// app/(root)/[locale]/dashboard/shipments/page.tsx
'use client';

import { DashboardPage } from '@/components/auth/DashboardPage';
import { Can, DisableIf } from '@/components/auth/AccessControl';
import { usePermissions } from '@/hooks/use-permissions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Download } from 'lucide-react';

export default function ShipmentsPage() {
  const { hasPermission } = usePermissions();

  return (
    <DashboardPage
      requiredPermission="VIEW_SHIPMENT"
      title="Shipments"
      description="Manage all shipments across EAC region"
      showBackButton={true}
    >
      {/* Create button - only for authorized roles */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <Can permission="CREATE_SHIPMENT">
            <Button>Create Shipment</Button>
          </Can>

          <Can permission="EXPORT_DATA">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </Can>
        </div>

        {/* Filters visible to all */}
        <ShipmentFilters />
      </div>

      {/* Shipments table */}
      <ShipmentsTable />
    </DashboardPage>
  );
}

function ShipmentsTable() {
  const shipments = [
    {
      id: '1',
      trackingNumber: 'SHP001',
      origin: 'Nairobi',
      destination: 'Kampala',
      status: 'in-transit',
      driver: 'John Doe',
    },
    // ... more shipments
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-left">Tracking #</th>
            <th className="p-4 text-left">Route</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Driver</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <ShipmentRow key={shipment.id} shipment={shipment} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShipmentRow({ shipment }: any) {
  return (
    <tr className="border-t hover:bg-muted/50">
      <td className="p-4 font-medium">{shipment.trackingNumber}</td>
      <td className="p-4">
        {shipment.origin} → {shipment.destination}
      </td>
      <td className="p-4">
        <Badge>{shipment.status}</Badge>
      </td>
      <td className="p-4">{shipment.driver}</td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          {/* View - all roles */}
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>

          {/* Edit - conditional */}
          <Can permission="EDIT_SHIPMENT">
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Can>

          {/* Delete - admin only with disabled state */}
          <DisableIf
            permission="DELETE_SHIPMENT"
            reason="Only admins can delete shipments"
          >
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash2 className="w-4 h-4" />
            </Button>
          </DisableIf>
        </div>
      </td>
    </tr>
  );
}

function ShipmentFilters() {
  return (
    <div className="flex gap-2">
      <select className="border rounded px-3 py-2">
        <option>All Status</option>
        <option>Pending</option>
        <option>In Transit</option>
        <option>Delivered</option>
      </select>

      {/* Country filter - only for multi-country shippers */}
      <Can permission="VIEW_ANALYTICS">
        <select className="border rounded px-3 py-2">
          <option>All Countries</option>
          <option>Kenya</option>
          <option>Uganda</option>
          <option>Tanzania</option>
        </select>
      </Can>
    </div>
  );
}
```

### Example 3: Settings Page with Granular Controls

```tsx
// app/(root)/[locale]/dashboard/settings/page.tsx
'use client';

import { DashboardPage } from '@/components/auth/DashboardPage';
import { Can, ShowForRole } from '@/components/auth/AccessControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_SETTINGS"
      title="Settings"
      description="Manage your account and preferences"
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          {/* All roles see profile */}
          <TabsTrigger value="profile">Profile</TabsTrigger>

          {/* Only shippers and admins see company */}
          <Can permission="MANAGE_SETTINGS">
            <TabsTrigger value="company">Company</TabsTrigger>
          </Can>

          {/* Only admins see team */}
          <ShowForRole roles={['admin']}>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </ShowForRole>
        </TabsList>

        {/* Profile Tab - Available to all */}
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        {/* Company Tab - Shipper & Admin */}
        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        {/* Team Tab - Admin only */}
        <TabsContent value="team">
          <TeamSettings />
        </TabsContent>

        {/* API Tab - Admin only */}
        <TabsContent value="api">
          <APISettings />
        </TabsContent>
      </Tabs>
    </DashboardPage>
  );
}

function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <Input placeholder="John Doe" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="john@example.com" />
        </div>

        {/* Driver-specific field */}
        <ShowForRole roles={['driver']}>
          <div>
            <label className="text-sm font-medium">License Number</label>
            <Input placeholder="DL-123456" />
          </div>
        </ShowForRole>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
}

function TeamSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Can permission="MANAGE_USERS">
          <Button>Invite Member</Button>
        </Can>
        {/* Team list */}
      </CardContent>
    </Card>
  );
}

function APISettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <Can permission="MANAGE_SETTINGS">
          <Button>Generate New Key</Button>
        </Can>
        {/* API keys list */}
      </CardContent>
    </Card>
  );
}
```

### Example 4: Protected API Route

```typescript
// app/api/fleet/vehicles/route.ts
import { NextRequest } from 'next/server';
import {
  withRole,
  requireResourceAccess,
  createSuccessResponse,
  applyRateLimit,
  auditLog,
} from '@/lib/auth/api-protection';
import { UserRole } from '@/lib/auth/roles';
import { ResourceType, Action } from '@/lib/auth/access-control';

/**
 * GET /api/fleet/vehicles
 * List all vehicles (Shipper and Admin only)
 */
export const GET = withRole(
  [UserRole.SHIPPER, UserRole.ADMIN],
  async (request: NextRequest, user) => {
    // Apply rate limiting
    const rateLimit = await applyRateLimit(request, 100, 60000);
    if (rateLimit.error) return rateLimit.error;

    // Audit log
    await auditLog(user.id, 'LIST_VEHICLES', 'fleet/vehicles');

    // Fetch vehicles for user's company
    const vehicles = await fetchVehicles(user.companyId);

    return createSuccessResponse(
      { vehicles, total: vehicles.length },
      200
    );
  }
);

/**
 * POST /api/fleet/vehicles
 * Create new vehicle (Admin only)
 */
export const POST = withRole(
  [UserRole.ADMIN],
  async (request: NextRequest, user) => {
    // Check specific resource access
    const { error } = await requireResourceAccess(
      request,
      ResourceType.VEHICLE,
      Action.CREATE
    );

    if (error) return error;

    const body = await request.json();

    // Validate and create vehicle
    const vehicle = await createVehicle({
      ...body,
      companyId: user.companyId,
      createdBy: user.id,
    });

    // Audit log
    await auditLog(user.id, 'CREATE_VEHICLE', 'fleet/vehicles', { vehicleId: vehicle.id });

    return createSuccessResponse(
      { vehicle },
      201
    );
  }
);

// Helper functions (replace with actual DB calls)
async function fetchVehicles(companyId?: string) {
  return [
    { id: '1', name: 'Truck 001', status: 'active', companyId },
    { id: '2', name: 'Truck 002', status: 'maintenance', companyId },
  ];
}

async function createVehicle(data: any) {
  return { id: Date.now().toString(), ...data };
}
```

### Example 5: Using Hooks for Dynamic UI

```tsx
// components/dashboard/ShipmentCard.tsx
'use client';

import { usePermissions } from '@/hooks/use-permissions';
import { useFeatureFlag } from '@/components/auth/AccessControl';
import { Feature } from '@/lib/auth/access-control';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ShipmentCard({ shipment }: { shipment: any }) {
  const { hasPermission, userRole } = usePermissions();
  const hasRouteOptimization = useFeatureFlag(Feature.ROUTE_OPTIMIZATION);

  // Determine available actions based on permissions
  const canEdit = hasPermission('EDIT_SHIPMENT');
  const canDelete = hasPermission('DELETE_SHIPMENT');
  const canAssign = hasPermission('ASSIGN_DRIVER');

  // Role-specific badge color
  const getBadgeColor = () => {
    switch (userRole) {
      case 'admin': return 'bg-purple-500';
      case 'shipper': return 'bg-blue-500';
      case 'driver': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{shipment.trackingNumber}</h3>
            <p className="text-sm text-muted-foreground">
              {shipment.origin} → {shipment.destination}
            </p>
          </div>
          <Badge className={getBadgeColor()}>
            {userRole?.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge>{shipment.status}</Badge>
          </div>

          {/* Show route optimization for eligible users */}
          {hasRouteOptimization && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Optimized Route:</span>
              <span className="font-medium text-green-600">4.2km shorter</span>
            </div>
          )}

          {/* Driver assignment - conditional */}
          {canAssign && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Driver:</span>
              <Button variant="link" size="sm">
                {shipment.driver || 'Assign Driver'}
              </Button>
            </div>
          )}
        </div>

        {/* Action buttons - role-based */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>

          {canEdit && (
            <Button variant="outline" size="sm">
              Edit
            </Button>
          )}

          {canDelete && (
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          )}
        </div>

        {/* Admin-only debug info */}
        {userRole === 'admin' && (
          <div className="mt-4 p-3 bg-muted rounded text-xs">
            <p>Company: {shipment.companyId}</p>
            <p>Created: {new Date(shipment.createdAt).toLocaleString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## Summary

These examples demonstrate:

1. ✅ **Multi-layer protection** - Middleware, page, component, and API levels
2. ✅ **Role-based rendering** - Different UI for different roles
3. ✅ **Permission checks** - Granular feature control
4. ✅ **Feature flags** - Enable/disable entire features
5. ✅ **Resource access** - CRUD operation control
6. ✅ **Rate limiting** - API protection
7. ✅ **Audit logging** - Compliance tracking
8. ✅ **User experience** - Clear feedback and upgrade prompts

All implementations follow best practices from top-tier applications like Stripe, Vercel, and AWS Console.
