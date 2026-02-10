# Sample Data for Tracking Simulation

This module provides comprehensive sample data and utilities to simulate GPS tracking for EAC freight logistics.

## 📁 File Structure

```
lib/sample-data/
├── routes.ts              # EAC freight corridors and city definitions
├── trucks.ts              # Sample fleet data (10 trucks)
├── shipments.ts           # Sample shipments (8 active/completed)
├── gps-simulator.ts       # GPS movement simulation utilities
└── index.ts               # Central export point
```

## 🚚 Features

### 1. **Freight Corridors**
Pre-defined routes across East African Community:
- **Nairobi-Kampala** (800 km, 16 hrs)
- **Mombasa-Dar es Salaam** (650 km, 13 hrs)
- **Nairobi-Dar es Salaam** (950 km, 19 hrs)
- **Kampala-Kigali** (410 km, 8 hrs)
- **Nairobi-Arusha** (400 km, 8 hrs)
- **Dar-Dodoma** (450 km, 9 hrs)
- **Kampala-Dar es Salaam** (1200 km, 24 hrs)

Each corridor includes:
- Named waypoints with coordinates
- Distance and estimated duration
- City descriptions and context

### 2. **Sample Fleet**
10 realistic trucks with:
- Plate numbers (e.g., KBZ-421, UAZ-102)
- Models and specifications (Mercedes-Benz Actros, Volvo FH, etc.)
- Capacity (15,000-30,000 kg)
- Assigned drivers with license info
- Current status (in_transit, idle, maintenance)
- Current location and destination

**Example:** Truck KBZ-421
- Driver: Samuel Kamau (License: DL-KE-2019-0001)
- Route: Nairobi → Kampala
- Status: In Transit
- Speed: ~70 km/h

### 3. **Sample Shipments**
8 realistic shipments covering:
- Various cargo types (rice, electronics, textiles, automotive parts, etc.)
- Different corridors and statuses
- Multi-currency support (KES, UGX, TZS)
- Shipper and consignee information
- Hazardous goods flagging
- Actual delivery tracking for completed shipments

**Example:** Shipment SHP-NAI-KMP-20260207-001
- Origin: Nairobi, Kenya → Destination: Kampala, Uganda
- Cargo: 6000 kg mixed goods
- Value: 45,000 KES
- Status: In Transit (ETA: ~4 hours)

### 4. **GPS Movement Simulator**
Utilities for realistic GPS updates:

#### Distance Calculation
```typescript
calculateDistance(lat1, lng1, lat2, lng2): number
// Returns distance in kilometers using Haversine formula
```

#### Heading/Bearing
```typescript
calculateHeading(lat1, lng1, lat2, lng2): number
// Returns compass bearing (0-360°)
```

#### Single GPS Update
```typescript
generateGPSUpdate(
  truckId,
  currentLat,
  currentLng,
  destinationLat,
  destinationLng,
  speedKmh = 60,
  timestamp
): GPSUpdate
```

#### Simulate Full Journey
```typescript
simulateTruckJourney(
  truckId,
  waypoints,
  journeyStartTime,
  speedKmh = 60,
  updateIntervalSeconds = 300
): GPSUpdate[]
// Returns array of GPS updates along entire route
```

#### Get Current Position on Route
```typescript
getTruckLocationOnRoute(
  truckId,
  waypoints,
  journeyStartTime,
  speedKmh = 60
): TruckLocation
// Returns current position, heading, ETA
```

#### Idle GPS Simulation
```typescript
generateIdleGPSUpdates(
  truckId,
  baseLat,
  baseLng,
  numUpdates = 12,
  intervalMinutes = 5
): GPSUpdate[]
// Simulates minor GPS drift for stationary vehicles
```

## 📡 API Endpoints

### Demo Tracking API: `/api/demo/tracking`

#### GET Requests

**1. Get all trucks**
```bash
GET /api/demo/tracking?action=trucks
```
Returns: Array of all 10 sample trucks

**2. Get specific truck**
```bash
GET /api/demo/tracking?action=trucks&truckId=truck-001
```
Returns: Single truck details

**3. Get corridors**
```bash
GET /api/demo/tracking?action=corridors
GET /api/demo/tracking?action=corridors&corridorId=nairobi-kampala
```
Returns: Freight corridor definitions with waypoints

**4. Get shipments**
```bash
GET /api/demo/tracking?action=shipments
GET /api/demo/tracking?action=shipments&truckId=truck-001
```
Returns: Shipments (filtered by truck if specified)

**5. Generate GPS update**
```bash
GET /api/demo/tracking?action=gps-update&truckId=truck-001
```
Returns: Single realistic GPS update for truck
```json
{
  "truckId": "truck-001",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "accuracy": 8.5,
  "heading": 245.3,
  "speed": 68.5,
  "altitude": 1450,
  "batteryLevel": 85,
  "timestamp": 1707315600000
}
```

**6. Simulate journey**
```bash
GET /api/demo/tracking?action=journey&truckId=truck-001&corridorId=nairobi-kampala
```
Returns: Complete journey simulation
```json
{
  "journey": {
    "truckId": "truck-001",
    "corridor": "Nairobi-Kampala Corridor",
    "currentLocation": {
      "latitude": -0.5,
      "longitude": 33.2,
      "heading": 320,
      "speed": 70,
      "destination": "Kampala",
      "distanceToDestination": 180,
      "estimatedArrival": "2026-02-07T18:30:00Z"
    },
    "recentUpdates": [...],
    "fullUpdatesCount": 18
  }
}
```

**7. Idle GPS updates**
```bash
GET /api/demo/tracking?action=idle&truckId=truck-005
```
Returns: GPS updates showing minor drift for idle truck

**8. Fleet statistics**
```bash
GET /api/demo/tracking?action=statistics
```
Returns: Summary of fleet and shipment status

#### POST Requests

**Batch GPS Updates**
```bash
POST /api/demo/tracking
Content-Type: application/json

{
  "action": "batch-gps-updates",
  "truckId": ["truck-001", "truck-003", "truck-007"],
  "speed": 70,
  "count": 10
}
```
Returns: GPS updates for multiple trucks

## 🔧 Usage Examples

### Import in Components
```typescript
import { SAMPLE_TRUCKS, SAMPLE_SHIPMENTS } from '@/lib/sample-data';
import { simulateTruckJourney, generateGPSUpdate } from '@/lib/sample-data/gps-simulator';
import { FREIGHT_CORRIDORS } from '@/lib/sample-data/routes';

// Get a specific truck
const truck = SAMPLE_TRUCKS.find(t => t.id === 'truck-001');

// Get all shipments for a truck
const shipments = SAMPLE_SHIPMENTS.filter(s => s.carrier.truckId === 'truck-001');

// Simulate journey
const corridor = FREIGHT_CORRIDORS.find(c => c.id === 'nairobi-kampala');
const updates = simulateTruckJourney(
  'truck-001',
  corridor.waypoints,
  new Date(),
  70
);
```

### Use in Map Components
```typescript
import { TruckMarker } from '@/components/maps/TruckMarker';

// Add markers for all trucks
{SAMPLE_TRUCKS.map(truck => (
  <TruckMarker
    key={truck.id}
    truckId={truck.id}
    initialLat={truck.lastLatitude}
    initialLng={truck.lastLongitude}
    onLocationUpdate={(lat, lng) => {
      // Update map marker
    }}
  />
))}
```

### Generate Real-time Updates
```typescript
// Simulate continuous GPS tracking
setInterval(async () => {
  const truck = SAMPLE_TRUCKS[0];
  const update = generateGPSUpdate(
    truck.id,
    truck.lastLatitude,
    truck.lastLongitude,
    0.3476, // Kampala
    32.5825
  );

  // Send to API
  await fetch('/api/gps/update', {
    method: 'POST',
    body: JSON.stringify(update)
  });
}, 5 * 60 * 1000); // Every 5 minutes
```

## 🎯 Data Characteristics

### Speed Simulation
- Idle vehicles: 0 km/h
- Highway trucks: 60-80 km/h
- Urban/populated: 40-60 km/h
- Random ±5 km/h variation

### GPS Accuracy
- Moving vehicles: 5-15 meters
- Idle vehicles: 3-8 meters
- Heading variation: ±5 degrees
- Altitude: 1000-1500 meters

### Battery Levels
- Active trucks: 70-90%
- Idle trucks: 90-100%
- Decreases slowly based on usage patterns

## 📊 Real-world Alignment

This sample data is based on:
- **Real EAC corridors** with actual distances
- **Current truck models** used in East African logistics
- **Realistic cargo types** transported in the region
- **Actual customs processes** (borders, delays)
- **Regional currencies** and pricing models
- **Multi-country operations** (KE, UG, TZ, RW, BI, SS)

## 🔗 Integration Points

1. **Tracking Dashboard** (`/app/[locale]/dashboard/tracking/page.tsx`)
   - Display truck markers from sample data
   - Show live movements
   
2. **GPS API** (`/app/api/gps/`)
   - Accept sample GPS updates
   - Store and broadcast
   
3. **Socket.io** (Real-time updates)
   - Stream GPS data to clients
   - Broadcasting to multiple users
   
4. **Shipment Tracking**
   - Link shipments to trucks
   - Show progress along route

## 📝 Notes

- All data is sample/dummy data for testing and development
- Timestamps are auto-generated at runtime
- Coordinates use actual EAC geography
- Speeds and distances are realistic but simplified
- No real shipper/driver information in production
- TTL indexes recommended for GPS log collection

## 🚀 Next Steps

To use this sample data in your application:

1. **Import in your tracking page**: See usage examples above
2. **Call demo API endpoints** to test data flow
3. **Integrate with Socket.io** for real-time updates
4. **Implement batch processing** for multiple GPS updates
5. **Add MongoDB storage** for GPS log persistence
6. **Create visualization** on map components
