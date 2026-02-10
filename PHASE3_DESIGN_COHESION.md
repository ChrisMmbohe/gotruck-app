# Phase 3: Design & Architectural Cohesion Guide

**Focus**: How Phase 3 integrates with overall system design and frontend consistency  
**Audience**: Frontend & Backend architects  
**Date**: February 10, 2026

---

## 🎨 DESIGN SYSTEM INTEGRATION

### Current GoTruck Design Language
The application uses a modern, professional design system based on:
- **Slate color palette** (primary): Slate-900 (#020617) for dark, Slate-600 for secondary
- **Accent colors**: Blue (#2563eb), Green (#10b981), Red (#ef4444), Amber (#f59e0b)
- **Typography**: Geist font family (Next.js default)
- **Components**: Radix UI + Tailwind CSS
- **Pattern**: Card-based layouts, badge status indicators, minimal borders

### Phase 3 Color Mapping (Consistency)

```typescript
// lib/design/tracking-colors.ts - NEW FILE
// Ensure tracking colors align with design system

export const TRUCK_STATUS_COLORS = {
  online: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-600',
    mapColor: '#2563eb',
    badge: 'bg-blue-100 text-blue-700'
  },
  offline: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-600',
    mapColor: '#6b7280',
    badge: 'bg-slate-100 text-slate-700'
  },
  stopped: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-600',
    mapColor: '#f59e0b',
    badge: 'bg-amber-100 text-amber-700'
  },
  alert: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-600',
    mapColor: '#ef4444',
    badge: 'bg-red-100 text-red-700'
  },
  maintenance: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-600',
    mapColor: '#a855f7',
    badge: 'bg-purple-100 text-purple-700'
  }
};

// Example usage consistency:
// Map marker color = mapColor
// Status badge = badge
// Detail card = bg + border + text
// Icon fill = text color

export const GEOFENCE_COLORS = {
  border: {
    // EAC border crossings
    fill: 'rgba(239, 68, 68, 0.1)',      // Red very transparent
    stroke: '#dc2626',                    // Red 600
    strokeWidth: 2,
    strokeDasharray: '5, 5',              // Dashed
    hoverOpacity: 0.2
  },
  checkpoint: {
    // Customs/police checkpoints
    fill: 'rgba(251, 146, 60, 0.15)',     // Orange
    stroke: '#ea580c',                    // Orange 600
    strokeWidth: 2,
    hoverOpacity: 0.25
  },
  safe: {
    // Safe delivery zones
    fill: 'rgba(16, 185, 129, 0.1)',      // Green
    stroke: '#059669',                    // Green 700
    strokeWidth: 1,
    hoverOpacity: 0.15
  },
  restricted: {
    // No-go zones
    fill: 'rgba(107, 114, 128, 0.1)',     // Gray
    stroke: '#6b7280',                    // Gray 500
    strokeWidth: 2,
    strokeDasharray: '10, 5',
    hoverOpacity: 0.2
  }
};
```

**Rationale**: 
- Blue for online (active, positive)
- Slate for offline (neutral, background)
- Amber for stopped (caution, intermediate)
- Red for alerts (danger, needs action)
- Purple for maintenance (special state)

---

## 🔄 FRONTEND STATE MANAGEMENT ARCHITECTURE

### Current Approach (Before Phase 3)
```typescript
// Client-side state: Zustand (client-only stores)
// Server state: React Query (API data)
// Layout state: React Context (nav, auth)

// Example from shipments page:
const { shipments } = useShipments();  // React Query
const { userRole } = useAuth();        // Auth context
const { toggle } = useUI();            // Zustand (UI store)
```

### Phase 3: Enhanced State Management

#### Tracking Store (Zustand)
```typescript
// lib/store/tracking-store.ts - NEW
import { create } from 'zustand';

interface TruckLocation {
  id: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  status: 'online' | 'offline' | 'stopped' | 'alert' | 'maintenance';
  lastUpdateAt: number;
  batteryLevel?: number;
}

interface GeofenceState {
  id: string;
  name: string;
  alerting: boolean;
  lastEventAt?: number;
}

export const useTrackingStore = create((set, get) => ({
  // Truck state
  trucks: new Map<string, TruckLocation>(),
  selectedTruck: null as string | null,
  
  // Geofence state (per truck)
  geofences: new Map<string, Set<GeofenceState>>(),
  
  // UI state
  showGeofences: true,
  mapZoom: 10,
  mapCenter: { lat: -1.5, lng: 35 } as [number, number],
  
  // Actions
  updateTruck: (truck: TruckLocation) => {
    set((state) => {
      const trucks = new Map(state.trucks);
      trucks.set(truck.id, truck);
      return { trucks };
    });
  },
  
  selectTruck: (truckId: string | null) => {
    set({ selectedTruck: truckId });
  },
  
  addGeofenceEvent: (truckId: string, event: GeofenceState) => {
    set((state) => {
      const geofences = new Map(state.geofences);
      if (!geofences.has(truckId)) {
        geofences.set(truckId, new Set());
      }
      geofences.get(truckId)?.add(event);
      return { geofences };
    });
  },
  
  setMapView: (zoom: number, center: [number, number]) => {
    set({ mapZoom: zoom, mapCenter: center });
  },
  
  clearOldData: (olderThan: number) => {
    set((state) => {
      const trucks = new Map(state.trucks);
      trucks.forEach((truck, id) => {
        if (truck.lastUpdateAt < olderThan) {
          trucks.delete(id);
        }
      });
      return { trucks };
    });
  }
}));

// Usage in components:
// const { trucks, selectedTruck, updateTruck } = useTrackingStore();
```

**Key Pattern**: 
- Zustand for **client state** (trucks, geofences, UI)
- React Query for **server state** (geofence definitions, historical data)
- Socket.io for **real-time updates** (new GPS coordinates)

**Flow**:
```
Socket.io event → useTrackingStore.updateTruck() → Component re-render
API query → React Query cache → Component re-render
```

---

## 🏗️ BACKEND ARCHITECTURE LAYERS

### API Routing Structure (Consistency with Existing)

Current structure in `app/api/v1/`:
```
/v1/
  /users/
  /shipments/
  /fleet/
  /analytics/
  /payments/
  /auth/
```

### Phase 3 New Routes (Maintain Pattern)
```
/v1/
  /gps/
    PUT, POST  /update          - Single GPS update
    POST       /batch           - Batch sync (offline)
    GET        /history/{id}    - Route history
    
  /geofences/
    GET        /                - List all (cached)
    POST       /                - Create new
    GET        /{id}            - Single geofence
    PUT        /{id}            - Update
    DELETE     /{id}            - Delete
    POST       /check           - Check point in zones
    GET        /{id}/events     - Event history
    
  /tracking/
    GET        /trucks          - Current positions (real-time)
    GET        /trucks/{id}     - Single truck live data
    GET        /shipments/{id}  - Shipment tracking with geofence
    GET        /events          - Live events stream
    
  /alerts/
    GET        /geofence        - Geofence alerts
    GET        /geofence/{id}   - Single geofence alerts
    POST       /geofence/acknowledge  - Mark as read
    DELETE     /geofence/{id}   - Clear alert
```

### Middleware Chain (Add to Existing)

```typescript
// app/api/v1/[...route]/route.ts
import { authMiddleware } from '@/lib/middleware/auth';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { validationMiddleware } from '@/lib/middleware/validation';
import { loggingMiddleware } from '@/lib/middleware/logging';

// All tracking APIs use this chain:
// Request → [Auth] → [RateLimit] → [Validation] → [Handler] → [Logging]
// Response

// Example handler structure:
export async function POST(req: Request) {
  // 1. Auth (verify user owns truck)
  const user = await authMiddleware(req);
  if (!user) return unauthorized();
  
  // 2. Rate limit (1 request per 5 sec per truck)
  const allowed = await rateLimitMiddleware(
    `gps:${body.truckId}`,
    { maxRequests: 1, window: 5000 }
  );
  if (!allowed) return rateLimited();
  
  // 3. Validate input
  const validated = validationMiddleware(body, GPSUpdateSchema);
  if (!validated.success) return badRequest(validated.error);
  
  // 4. Handler logic
  const result = await handleGPSUpdate(validated.data);
  
  // 5. Logging
  await loggingMiddleware({
    userId: user.id,
    action: 'gps_update',
    status: result.success ? 'ok' : 'error'
  });
  
  return success(result);
}
```

---

## 📱 COMPONENT HIERARCHY & COMPOSITION

### Existing Component Structure
```
DashboardPage (wrapper + auth)
  ├── Header (title, stats)
  ├── Filters/Search
  └── Content
      ├── Card(s)
      ├── Table/List
      └── Details Panel
```

### Phase 3: Tracking Page Structure (Consistent)

```typescript
// app/(root)/[locale]/dashboard/tracking/page.tsx
export default function TrackingPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_TRACKING"
      title="Live Tracking"
      description="Real-time vehicle monitoring"
    >
      <TrackingContent />
    </DashboardPage>
  );
}

function TrackingContent() {
  // 1. Page state
  const [filters, setFilters] = useState({});
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  
  // 2. Server data (definitions, config)
  const { data: geofences } = useGeofences();
  
  // 3. Real-time data (live positions)
  const { trucks, isUpdating } = useTrackingStream(filters);
  
  // 4. Store selections (client state)
  const { setSelectedTruck: storeSelect } = useTrackingStore();
  
  return (
    <div className="space-y-6">
      {/* Header: Title + Stats */}
      <Header trucks={trucks} filters={filters} />
      
      {/* Filters: Search, Status, Route */}
      <Filters onChange={setFilters} />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-[60%_40%] gap-4">
        {/* Left: Map with real-time markers */}
        <Card className="overflow-hidden">
          <MapContainer
            trucks={trucks}
            geofences={geofences}
            selectedTruck={selectedTruck}
            onTruckSelect={(id) => {
              setSelectedTruck(id);
              storeSelect(id);
            }}
            showClustering
            showGeofences
          />
        </Card>
        
        {/* Right: List view */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <TruckList
              trucks={trucks}
              selectedTruck={selectedTruck}
              onSelect={(id) => {
                setSelectedTruck(id);
                storeSelect(id);
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Details Panel: Bottom sheet / Modal */}
      {selectedTruck && (
        <TruckDetailsPanel
          truck={trucks.find(t => t.id === selectedTruck)}
          geofenceEvents={geofences}
          onClose={() => setSelectedTruck(null)}
        />
      )}
    </div>
  );
}
```

**Consistency Pattern**:
- Always wrap in DashboardPage (auth + layout)
- Always have Header (title, description, stats)
- Always have Filters (search, select, date range)
- Always use Card wrapper (consistency)
- Always follow grid layout pattern (responsive)
- Always include Details panel (drill-down capability)

---

## 🎯 INTERACTION PATTERNS & UX FLOW

### Pattern 1: Live Data Update Flow
```
Real-time Update → State Change → UI Re-render → Animation
                
Example: GPS coordinate arrives
  ↓
useTrackingStream() updates truck position
  ↓
Zustand store triggers re-render
  ↓
MapContainer receives new trucks prop
  ↓
TruckMarker smoothly animates to new position
  ↓
TruckListItem updates speed/heading info
  ↓
StatusIndicator updates color if status changed
```

### Pattern 2: User Selection Flow
```
User clicks truck on map
  ↓
onTruckSelect(truckId) handler
  ↓
Local state: selectedTruck = truckId
Store state: useTrackingStore.selectTruck(truckId)
  ↓
Map: selected truck highlighted
List: row expanded/highlighted
Details: panel slides in/opens
  ↓
User can close details
  ↓
All return to deselected state
```

### Pattern 3: Geofence Alert Flow
```
Truck crosses geofence boundary
  ↓
Backend: checkGeofenceEvents() detects entry
  ↓
publishAlert() queues notifications (SMS, Email, Push)
  ↓
Socket.io emits GEOFENCE_ALERT event
  ↓
Dashboard: GeofenceAlert component slides in (notification)
  ↓
Map: Truck marker color changes to red
  ↓
List: Status badge shows "ALERT"
  ↓
Sound plays (optional)
  ↓
User can acknowledge alert
  ↓
Notification dismissed, state cleared
```

---

## 🔐 PERMISSION & ACCESS CONTROL INTEGRATION

### Phase 3: Permission Matrix (Add to Existing RBAC)

```typescript
// lib/auth/permissions.ts (enhance)

export const TRACKING_PERMISSIONS = {
  // View
  'VIEW_TRACKING': {
    description: 'View live tracking dashboard',
    roles: ['shipper', 'admin', 'manager'],
    resource: 'tracking',
    action: 'view'
  },
  'VIEW_TRACKING_DETAILED': {
    description: 'View driver details and route history',
    roles: ['shipper', 'admin'],
    resource: 'tracking',
    action: 'view_detailed'
  },
  
  // Manage Geofences
  'MANAGE_GEOFENCES': {
    description: 'Create, edit, delete geofences',
    roles: ['admin', 'operations_manager'],
    resource: 'geofences',
    action: 'manage'
  },
  'VIEW_GEOFENCES': {
    description: 'View geofence definitions',
    roles: ['shipper', 'admin', 'manager'],
    resource: 'geofences',
    action: 'view'
  },
  
  // Alerts
  'VIEW_ALERTS': {
    description: 'View geofence and tracking alerts',
    roles: ['shipper', 'admin', 'manager'],
    resource: 'alerts',
    action: 'view'
  },
  'ACKNOWLEDGE_ALERTS': {
    description: 'Mark alerts as read',
    roles: ['shipper', 'admin', 'manager'],
    resource: 'alerts',
    action: 'acknowledge'
  },
  
  // Export
  'EXPORT_TRACKING_DATA': {
    description: 'Export tracking data to CSV/PDF',
    roles: ['admin'],
    resource: 'tracking',
    action: 'export'
  }
};

// Usage in components:
<Can permission="MANAGE_GEOFENCES">
  <Button>Create Geofence</Button>
</Can>

// Usage in API:
const allowed = await checkPermission(userId, 'VIEW_TRACKING_DETAILED');
if (!allowed) return unauthorized();
```

### Access Control in Tracking Page

```typescript
export default function TrackingPage() {
  const { hasPermission } = usePermissions();
  
  return (
    <DashboardPage requiredPermission="VIEW_TRACKING">
      {/* Show map for all users with VIEW_TRACKING */}
      <MapContainer trucks={trucks} />
      
      {/* Export button only for admins */}
      <Can permission="EXPORT_TRACKING_DATA">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Tracking Data
        </Button>
      </Can>
      
      {/* Geofence tab only if permission */}
      <Can permission="VIEW_GEOFENCES">
        <Tabs defaultValue="map">
          <TabsContent value="geofences">
            <GeofencesList />
          </TabsContent>
        </Tabs>
      </Can>
    </DashboardPage>
  );
}
```

---

## 🎨 VISUAL CONSISTENCY CHECKLIST

When building Phase 3 components, ensure:

- [ ] **Color**: Use TRUCK_STATUS_COLORS enum (not hardcoded hex)
- [ ] **Font**: Use Geist (default) for all text
- [ ] **Spacing**: Use Tailwind spacing scale (p-4, gap-6, m-8)
- [ ] **Borders**: Use opacity variants (border-blue-500/30)
- [ ] **Shadows**: Use card shadow (shadow-lg on hover)
- [ ] **Radius**: Use rounded-lg for boxes, rounded-full for avatars
- [ ] **Icons**: Use lucide-react (already imported in dashboards)
- [ ] **Loading**: Show spinner with "Loading..." text
- [ ] **Errors**: Use error card with red border and icon
- [ ] **Status badges**: Use Badge component from @/components/ui/badge
- [ ] **Cards**: Always wrap sections in Card component
- [ ] **Animation**: Use Tailwind animations or Framer Motion
- [ ] **Responsive**: Test on mobile (iPhone SE), tablet, desktop

### Example Component (Consistent Style)
```typescript
// ✅ Good - Consistent with GoTruck design
export function TruckListItem({ truck, selected, onSelect }) {
  const color = TRUCK_STATUS_COLORS[truck.status];
  
  return (
    <div
      onClick={() => onSelect(truck.id)}
      className={cn(
        'p-4 rounded-lg border-2 cursor-pointer transition-all',
        'hover:shadow-lg hover:border-blue-500/50',
        selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
      )}
    >
      {/* Icon + Status */}
      <div className="flex items-center gap-3 mb-2">
        <div className={cn('p-2 rounded-lg', color.bg)}>
          <Truck className={cn('h-4 w-4', color.text)} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">{truck.id}</p>
          <p className="text-xs text-slate-500">{truck.driver}</p>
        </div>
        <Badge className={color.badge}>{truck.status}</Badge>
      </div>
      
      {/* Stats row */}
      <div className="flex gap-4 text-sm">
        <div>
          <p className="text-slate-400">Speed</p>
          <p className="font-semibold">{truck.speed} km/h</p>
        </div>
        <div>
          <p className="text-slate-400">ETA</p>
          <p className="font-semibold">{truck.eta}</p>
        </div>
      </div>
    </div>
  );
}

// ❌ Bad - Inconsistent with design system
<div style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
  <div style={{ fontSize: '14px', color: '#333' }}>
    {truck.id}
  </div>
</div>
```

---

## 🔗 INTEGRATION TOUCHPOINTS WITH EXISTING FEATURES

### Dashboard Overview Page
```typescript
// Current: Shows KPIs and activity feed
// Phase 3 Impact:

// Add live truck count (from useTrackingStream)
<Card>
  <CardContent>
    <div className="flex items-center gap-3">
      <Activity className="h-5 w-5 text-green-600 animate-pulse" />
      <div>
        <p className="text-sm text-slate-600">Active Vehicles</p>
        <p className="text-2xl font-bold">{activeVehicles}</p>
      </div>
    </div>
  </CardContent>
</Card>

// Add mini map showing current positions
<Card>
  <CardHeader>
    <CardTitle>Fleet Map</CardTitle>
  </CardHeader>
  <CardContent>
    <MiniMapContainer trucks={trucks.slice(0, 10)} />
  </CardContent>
</Card>
```

### Shipments Page
```typescript
// Current: Shows shipment list with status
// Phase 3 Impact:

// Link shipment to live truck
<div className="flex items-center gap-2">
  <Truck className="h-4 w-4" />
  <span>{truck.id}</span>
  <Badge className={getTruckStatusColor(truck.status)}>
    {truck.status}
  </Badge>
</div>

// Show live ETA instead of calculated
<Badge variant="success">
  ETA: {shipment.truck.liveETA} (updated now)
</Badge>

// Click to track
<Button 
  variant="outline" 
  onClick={() => router.push('/dashboard/tracking?truck=' + truck.id)}
>
  <MapPin className="h-3 w-3 mr-2" />
  Track Live
</Button>
```

### Analytics Page
```typescript
// Current: Shows route performance metrics
// Phase 3 Impact:

// Add real-time metrics
<Card>
  <CardHeader>
    <CardTitle>Live Metrics</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <MetricRow
        label="Average Speed Today"
        value={`${avgSpeed} km/h`}
        trend="+2.5%"
      />
      <MetricRow
        label="On-time Delivery Rate"
        value={`${onTimeRate}%`}
        trend="+5%"
      />
      <MetricRow
        label="Active Geofence Alerts"
        value={alertCount}
        isAlert={alertCount > 0}
      />
    </div>
  </CardContent>
</Card>

// Link to geofence performance
<Chart>
  <data from="/api/v1/analytics/geofence-performance" />
</Chart>
```

---

## 🚀 PERFORMANCE MONITORING INTEGRATION

### Metrics to Add to Existing Monitoring

```typescript
// lib/monitoring/performance-metrics.ts (enhance existing)

// GPS Processing Metrics
export const trackGPSMetrics = {
  gps_update_latency: 'histogram',      // Time from POST to DB
  gps_batch_sync_time: 'histogram',     // Batch 1000 records time
  geofence_check_latency: 'histogram',  // Time to detect geofence
  socket_broadcast_latency: 'histogram' // Time to emit event
};

// Frontend Metrics
export const trackUIMetrics = {
  map_render_fps: 'gauge',              // FPS of map with markers
  marker_update_latency: 'histogram',   // Map animation speed
  virtual_list_render_time: 'histogram',// Truck list render
  socket_reconnect_time: 'histogram'    // WebSocket reconnect
};

// Alert Metrics
export const trackAlertMetrics = {
  geofence_detection_accuracy: 'counter',  // True positives
  alert_delivery_time: 'histogram',        // SMS/Email latency
  alert_false_positive_rate: 'gauge'       // Incorrect alerts
};

// Example implementation:
async function updateGPS(payload) {
  const startTime = Date.now();
  
  try {
    // Process GPS
    await GPSLog.create(payload);
    
    // Check geofence
    const events = await checkGeofenceEvents(...);
    
    // Calculate latency
    const latency = Date.now() - startTime;
    metrics.histogram('gps_update_latency', latency);
    
    // Emit event
    io.emit('gps:update', { ...payload, latency });
  } catch (error) {
    metrics.counter('gps_update_error', 1);
    throw error;
  }
}
```

### Grafana Dashboard Addition
```
+─────────────────────────────────────────+
│ GPS Tracking Performance Dashboard       │
├─────────────────────────────────────────+
│ GPS Update Latency (p50/p95/p99)        │
│ [Graph showing: 45ms / 120ms / 350ms]   │
├─────────────────────────────────────────+
│ Map Rendering FPS (100 trucks)          │
│ [Graph showing: 60 FPS during updates]  │
├─────────────────────────────────────────+
│ Geofence Detection Accuracy             │
│ [Graph showing: 99.9% accuracy]         │
├─────────────────────────────────────────+
│ Most Congested Geofences (alerts/day)   │
│ [Graph showing: Border X → 45 alerts]   │
├─────────────────────────────────────────+
│ Socket.io Connection Health             │
│ [Graph showing: 99.5% uptime]           │
└─────────────────────────────────────────+
```

---

## 📊 TESTING PATTERNS (Consistency)

### Existing Test Structure
```
__tests__/
  /api/         # API route tests
  /components/  # Component tests
  /lib/         # Utility tests
  /e2e/         # End-to-end tests
```

### Phase 3: New Test Files (Maintain Pattern)
```
__tests__/
  /api/
    /gps/
      gps-update.test.ts
      gps-batch.test.ts
      geofence-check.test.ts
  /components/
    /tracking/
      MapContainer.test.tsx
      TruckMarker.test.tsx
      TruckList.test.tsx
  /lib/
    /socket/
      socket-integration.test.ts
    /geofencing/
      detector.test.ts
  /e2e/
    /tracking/
      tracking-flow.spec.ts
```

### Test Template Pattern
```typescript
// __tests__/api/gps/gps-update.test.ts
describe('POST /api/v1/gps/update', () => {
  const mockGPSData = {
    truckId: 'test-truck',
    latitude: -1.5,
    longitude: 35,
    accuracy: 15,
    timestamp: Date.now()
  };
  
  beforeEach(async () => {
    // Setup test database
    await setupTestDB();
  });
  
  afterEach(async () => {
    // Cleanup
    await cleanupTestDB();
  });
  
  test('should store GPS update', async () => {
    const response = await request(app)
      .post('/api/v1/gps/update')
      .send(mockGPSData);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify in database
    const record = await GPSLog.findById(response.body.data.coordinateId);
    expect(record).toBeDefined();
    expect(record.latitude).toBe(mockGPSData.latitude);
  });
  
  test('should emit Socket.io event', async () => {
    const socketSpy = jest.spyOn(io, 'emit');
    
    await request(app)
      .post('/api/v1/gps/update')
      .send(mockGPSData);
    
    expect(socketSpy).toHaveBeenCalledWith(
      SOCKET_EVENTS.GPS_UPDATE,
      expect.objectContaining({
        truckId: mockGPSData.truckId
      })
    );
  });
});
```

---

## 🎯 MIGRATION CHECKLIST (Phase 2 to Phase 3)

Before launching Phase 3, ensure Phase 2 components are ready:

- [ ] All API endpoints have validation (Zod schemas)
- [ ] All APIs return standard response format
- [ ] All APIs have authentication middleware
- [ ] All APIs have rate limiting
- [ ] All database models have proper indexes
- [ ] All database models have audit trails
- [ ] React Query is configured with proper cache times
- [ ] Zustand stores are created for all client state
- [ ] Socket.io server is running and tested
- [ ] Redis is connected and keys namespaced
- [ ] Error handling is consistent
- [ ] Logging is structured (JSON format)
- [ ] Monitoring is set up (Sentry, CloudWatch)

---

## 📈 SCALABILITY CONSIDERATIONS

### Current Architecture Limits
- **Trucks**: ~500 (current sample data)
- **WebSocket connections**: Limited by server memory
- **GPS update rate**: 10 RPS per API instance (no load balancing)

### Phase 3: Scale to Production
```typescript
// Support 5000+ trucks across EAC

// 1. Horizontal scaling (multiple API instances)
//    - Load balancer distributes requests
//    - Redis pub/sub broadcasts globally
//    - Socket.io with Redis adapter for multi-server support

// 2. Database optimization
//    - GPS collection: TTL index for 30-day cleanup
//    - Geofence collection: stays small (<1000 docs)
//    - Archive old GPS to TimescaleDB annually

// 3. Caching strategy
//    - Geofence definitions: cache 1 hour
//    - Truck position: cache 10 seconds
//    - Border definitions: cache 24 hours

// 4. WebSocket optimization
//    - Room-based broadcasting (no global broadcasts)
//    - Compression enabled
//    - Idle timeout: 5 minutes

// Architecture after Phase 3:
//
// Load Balancer
//   ├─ API Instance 1 → Redis → MongoDB
//   ├─ API Instance 2 → Redis → MongoDB
//   └─ API Instance 3 → Redis → MongoDB
//
// Socket.io with Redis Adapter
//   ├─ Server 1 (2000 drivers)
//   ├─ Server 2 (2000 drivers)
//   └─ Server 3 (1000 drivers)
```

---

## 🔮 FUTURE PHASE INTEGRATION PREP

### Phase 4: Shipment Management (Will use Phase 3 data)
```typescript
// Shipment status "In Transit" will show:
// - Live truck position (from Phase 3)
// - Real-time ETA (calculated from GPS speed)
// - Geofence alerts (border crossings, checkpoints)
// - Driver info (from Phase 6)
```

### Phase 5: Predictive Analytics (Will use Phase 3 GPS history)
```typescript
// Route optimization will analyze:
// - Historical GPS data (Phase 3)
// - Traffic patterns (from GPS timestamps)
// - Border crossing delays (geofence events)
// - Fuel consumption (speed, acceleration patterns)
```

### Phase 8: Customs Integration (Will use Phase 3 geofences)
```typescript
// Pre-clearance system will trigger on:
// - Geofence entry (from Phase 3)
// - Border type (geofence metadata)
// - Required documents (pre-populated)
```

---

## 🎓 DESIGN PRINCIPLES FOR PHASE 3

### 1. **Real-time First**
Every component should assume data changes frequently. No "stale" UI.

### 2. **Minimal Latency**
<500ms from GPS update to dashboard display. <100ms for geofence detection.

### 3. **Graceful Degradation**
- Map fails → show list
- Socket disconnects → show last known position
- GPS API down → queue locally and sync later
- Geofence service fails → still track, alerts delayed

### 4. **Mobile-Friendly**
- Driver tracking: minimal UI, large buttons
- Admin dashboard: rich visualization, keyboard shortcuts

### 5. **Accessibile**
- Color-blind safe (status colors + icons)
- Screen reader compatible (aria labels)
- Keyboard navigation (tracking page fully keyboard usable)

### 6. **Auditable**
- Every GPS update logged with source
- Geofence events timestamped
- User actions tracked (acknowledged alerts, etc)

---

**Document Version**: 1.0  
**Last Updated**: February 10, 2026  
**Status**: Ready for Team Review
