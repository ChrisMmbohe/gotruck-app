# Quick Reference: Tracking Sample Data

## 🎯 What's Available

### Files Created
```
lib/sample-data/
├── routes.ts                  # 7 EAC corridors + major cities
├── trucks.ts                  # 10 realistic trucks with drivers
├── shipments.ts               # 8 active/completed shipments
├── gps-simulator.ts           # GPS movement calculations
├── utils.ts                   # Helper functions
└── index.ts                   # Central exports

app/api/demo/tracking/
└── route.ts                   # Demo API endpoints

docs/
├── SAMPLE_DATA_TRACKING.md    # Full documentation
└── SAMPLE_DATA_EXAMPLES.md    # Code examples
```

## 🚀 Quick Start (5 minutes)

### 1. Test API Endpoints

```bash
# Get all sample trucks
curl "http://localhost:3000/api/demo/tracking?action=trucks"

# Get a specific truck
curl "http://localhost:3000/api/demo/tracking?action=trucks&truckId=truck-001"

# Generate GPS update
curl "http://localhost:3000/api/demo/tracking?action=gps-update&truckId=truck-001"

# Get journey simulation
curl "http://localhost:3000/api/demo/tracking?action=journey&truckId=truck-001&corridorId=nairobi-kampala"

# Get fleet statistics
curl "http://localhost:3000/api/demo/tracking?action=statistics"
```

### 2. Use in Your Code

```typescript
// Import sample data
import { SAMPLE_TRUCKS, SAMPLE_SHIPMENTS } from '@/lib/sample-data';
import { generateGPSUpdate } from '@/lib/sample-data/gps-simulator';

// Get truck
const truck = SAMPLE_TRUCKS[0];
console.log(truck.plateNumber); // "KBZ-421"

// Generate GPS update
const gpsUpdate = generateGPSUpdate(
  truck.id,
  truck.lastLatitude,
  truck.lastLongitude,
  0.3476, // Kampala
  32.5825
);

// Send to API
await fetch('/api/gps/update', {
  method: 'POST',
  body: JSON.stringify(gpsUpdate)
});
```

### 3. Display on Map

```typescript
import { TruckMarker } from '@/components/maps/TruckMarker';
import { SAMPLE_TRUCKS } from '@/lib/sample-data';

export function FleetMap() {
  return (
    <div>
      {SAMPLE_TRUCKS.filter(t => t.status === 'in_transit').map(truck => (
        <TruckMarker
          key={truck.id}
          truckId={truck.id}
          initialLat={truck.lastLatitude}
          initialLng={truck.lastLongitude}
        />
      ))}
    </div>
  );
}
```

## 📊 Sample Data Stats

| Entity | Count | Status |
|--------|-------|--------|
| Trucks | 10 | 4 in_transit, 4 idle, 2 maintenance |
| Shipments | 8 | 6 in_transit, 2 delivered |
| Corridors | 7 | Connected via waypoints |
| Cities | 10 | Across 6 countries |
| Drivers | 10 | With license numbers |

## 🗺️ Available Routes

1. **Nairobi → Kampala** (800 km)
2. **Mombasa → Dar es Salaam** (650 km)
3. **Nairobi → Dar es Salaam** (950 km)
4. **Kampala → Kigali** (410 km)
5. **Nairobi → Arusha** (400 km)
6. **Dar → Dodoma** (450 km)
7. **Kampala → Dar es Salaam** (1200 km)

## 🔧 Common Tasks

### Generate Moving Truck Updates
```typescript
import { generateGPSUpdate } from '@/lib/sample-data/gps-simulator';

const update = generateGPSUpdate(
  'truck-001',
  -1.2921,      // Current latitude (Nairobi)
  36.8219,      // Current longitude
  0.3476,       // Destination latitude (Kampala)
  32.5825,      // Destination longitude
  70            // Speed km/h
);
```

### Simulate Full Journey
```typescript
import { simulateTruckJourney } from '@/lib/sample-data/gps-simulator';
import { FREIGHT_CORRIDORS } from '@/lib/sample-data/routes';

const corridor = FREIGHT_CORRIDORS[0]; // Nairobi-Kampala
const updates = simulateTruckJourney(
  'truck-001',
  corridor.waypoints,
  new Date(),
  70,           // km/h
  3600          // Update every hour
);
```

### Get Current Location on Route
```typescript
import { getTruckLocationOnRoute } from '@/lib/sample-data/gps-simulator';

const location = getTruckLocationOnRoute(
  'truck-001',
  corridor.waypoints,
  journeyStartTime,
  70
);
// Returns: { latitude, longitude, heading, speed, destination, estimatedArrival }
```

### Get Fleet Statistics
```typescript
import { getFleetUtilization } from '@/lib/sample-data/utils';

const stats = getFleetUtilization();
console.log(stats.percentage);      // 40
console.log(stats.breakdown);       // { in_transit: 4, idle: 4, ... }
```

### Estimate Fuel Consumption
```typescript
import { estimateFuelConsumption } from '@/lib/sample-data/utils';

const fuel = estimateFuelConsumption(800, 'truck', 'diesel');
console.log(fuel.consumption);      // liters
console.log(fuel.cost);             // KES
```

## 🔌 API Endpoints

### GET /api/demo/tracking

| Query Param | Value | Returns |
|-------------|-------|---------|
| `action=trucks` | - | All 10 trucks |
| `action=trucks&truckId=truck-001` | - | Single truck |
| `action=corridors` | - | All 7 corridors |
| `action=corridors&corridorId=nairobi-kampala` | - | Single corridor |
| `action=shipments` | - | First 5 shipments |
| `action=shipments&truckId=truck-001` | - | Shipments for truck |
| `action=gps-update&truckId=truck-001` | - | Single GPS update |
| `action=journey&truckId=truck-001&corridorId=nairobi-kampala` | - | Journey simulation |
| `action=idle&truckId=truck-001` | - | 6 idle GPS updates |
| `action=statistics` | - | Fleet summary |

### POST /api/demo/tracking

```json
{
  "action": "batch-gps-updates",
  "truckId": ["truck-001", "truck-003", "truck-007"],
  "speed": 70
}
```
Returns: GPS updates for multiple trucks

## 🎨 Data Characteristics

### Speed Simulation
- **Moving**: 60-80 km/h (±5 km/h variation)
- **Idle**: 0 km/h
- **Urban**: 40-60 km/h

### GPS Accuracy
- **Moving**: 5-15 meters
- **Idle**: 3-8 meters
- **Heading**: ±5 degrees
- **Altitude**: 1000-1500 meters

### Battery Levels
- **Active**: 70-90%
- **Idle**: 90-100%

## 📱 Real-time Updates Setup

```typescript
// Auto-update truck positions every 5 minutes
setInterval(async () => {
  const trucks = SAMPLE_TRUCKS.filter(t => t.status === 'in_transit');
  
  const updates = trucks.map(truck => 
    generateGPSUpdate(
      truck.id,
      truck.lastLatitude,
      truck.lastLongitude,
      0.3476, // Kampala
      32.5825,
      70
    )
  );

  // Send batch
  await fetch('/api/gps/batch', {
    method: 'POST',
    body: JSON.stringify({ updates })
  });
}, 5 * 60 * 1000);
```

## 🔍 Validation

### Check GPS Coordinates
```typescript
import { validateCoordinates } from '@/lib/sample-data/utils';

const { valid, error } = validateCoordinates(-1.2921, 36.8219);
if (!valid) console.error(error);
```

### Format GPS Update
```typescript
import { formatGPSUpdate } from '@/lib/sample-data/utils';

const formatted = formatGPSUpdate(gpsUpdate);
// Rounds coordinates and speeds appropriately
```

## 📤 Export Data

### Generate GPX Track
```typescript
import { generateGPXTrack } from '@/lib/sample-data/utils';

const corridor = FREIGHT_CORRIDORS[0];
const gpxData = generateGPXTrack('truck-001', corridor);

// Download as file
const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'truck-route.gpx';
a.click();
```

## 🚨 Troubleshooting

### API returns 404
- Check truckId format: `truck-001` not `truck_001`
- Verify action name (typo in action param)

### GPS coordinates invalid
- Latitude: -90 to 90
- Longitude: -180 to 180
- Use validateCoordinates() to check

### No data for truck
- Not all trucks have active shipments
- Check truck status: some are 'idle' or 'maintenance'

## 📚 Learn More

- **Full documentation**: See [SAMPLE_DATA_TRACKING.md](./docs/SAMPLE_DATA_TRACKING.md)
- **Code examples**: See [SAMPLE_DATA_EXAMPLES.md](./docs/SAMPLE_DATA_EXAMPLES.md)
- **Route definitions**: Check [routes.ts](./lib/sample-data/routes.ts)
- **GPS simulator**: Check [gps-simulator.ts](./lib/sample-data/gps-simulator.ts)

## ✅ Checklist

- [x] 10 sample trucks with drivers
- [x] 8 sample shipments across EAC
- [x] 7 freight corridors with waypoints
- [x] GPS movement simulator
- [x] Distance & heading calculations
- [x] Real-time update API
- [x] Journey simulation
- [x] Idle vehicle monitoring
- [x] Batch GPS processing
- [x] Fuel consumption estimation
- [x] GPX export support
- [x] Full documentation

## 🎯 Next Steps

1. **Test APIs**: Use curl commands to verify endpoints
2. **Integrate**: Import sample data in your components
3. **Visualize**: Display trucks on map with TruckMarker
4. **Automate**: Set up periodic GPS updates
5. **Monitor**: Track shipments with sample data
6. **Export**: Generate reports with summary data

## 📞 Support

For issues or questions:
1. Check [SAMPLE_DATA_TRACKING.md](./docs/SAMPLE_DATA_TRACKING.md) for detailed docs
2. Review [SAMPLE_DATA_EXAMPLES.md](./docs/SAMPLE_DATA_EXAMPLES.md) for code patterns
3. Test endpoints with curl commands above
4. Report issues with exact error message and query params
