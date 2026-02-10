/**
 * Sample Data Utilities & Helpers
 * Additional utilities for working with sample tracking data
 */

import { FREIGHT_CORRIDORS, MAJOR_CITIES } from './routes';
import { SAMPLE_TRUCKS } from './trucks';
import { SAMPLE_SHIPMENTS } from './shipments';
import {
  simulateTruckJourney,
  getTruckLocationOnRoute,
  calculateDistance,
  TruckLocation,
  GPSUpdate,
} from './gps-simulator';

/**
 * Enum for different time zones in EAC
 */
export enum EACTimeZone {
  KENYA = 'Africa/Nairobi',
  UGANDA = 'Africa/Kampala',
  TANZANIA = 'Africa/Dar_es_Salaam',
  RWANDA = 'Africa/Kigali',
  BURUNDI = 'Africa/Bujumbura',
  SOUTH_SUDAN = 'Africa/Juba',
}

/**
 * Get time zone for a country code
 */
export function getTimeZoneByCountry(countryCode: string): string {
  const timeZones: Record<string, string> = {
    KE: EACTimeZone.KENYA,
    UG: EACTimeZone.UGANDA,
    TZ: EACTimeZone.TANZANIA,
    RW: EACTimeZone.RWANDA,
    BI: EACTimeZone.BURUNDI,
    SS: EACTimeZone.SOUTH_SUDAN,
  };
  return timeZones[countryCode] || EACTimeZone.KENYA;
}

/**
 * Get currency for a country code
 */
export function getCurrencyByCountry(
  countryCode: string
): 'KES' | 'UGX' | 'TZS' | undefined {
  const currencies: Record<string, 'KES' | 'UGX' | 'TZS'> = {
    KE: 'KES',
    UG: 'UGX',
    TZ: 'TZS',
    RW: 'RWF', // Note: Rwanda uses Rwandan Franc, not in our enum
    BI: 'BIF', // Note: Burundi uses Burundi Franc
    SS: 'SSP', // Note: South Sudan uses South Sudan Pound
  };
  return currencies[countryCode] as 'KES' | 'UGX' | 'TZS' | undefined;
}

/**
 * Generate a realistic tracking number
 */
export function generateTrackingNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SHIP-${random}-${timestamp}`;
}

/**
 * Generate a realistic license plate number
 */
export function generateLicensePlate(countryCode: 'KE' | 'UG' | 'TZ' | 'RW' = 'KE'): string {
  const letters = countryCode;
  const numbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${letters}-${numbers}`;
}

/**
 * Get all trucks that are currently in transit
 */
export function getActiveFleet() {
  return SAMPLE_TRUCKS.filter((t) => t.status === 'in_transit');
}

/**
 * Get fleet utilization percentage
 */
export function getFleetUtilization(): {
  percentage: number;
  active: number;
  total: number;
  breakdown: Record<string, number>;
} {
  const total = SAMPLE_TRUCKS.length;
  const breakdown: Record<string, number> = {
    available: 0,
    in_transit: 0,
    maintenance: 0,
    inactive: 0,
  };

  SAMPLE_TRUCKS.forEach((truck) => {
    breakdown[truck.status]++;
  });

  const active = breakdown.in_transit;
  const percentage = (active / total) * 100;

  return {
    percentage: Math.round(percentage * 100) / 100,
    active,
    total,
    breakdown,
  };
}

/**
 * Get estimated delivery time for a shipment
 */
export function getEstimatedDeliveryTime(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  speedKmh: number = 70
): Date {
  const distance = calculateDistance(originLat, originLng, destLat, destLng);
  const hours = distance / speedKmh;
  const delayBufferMinutes = 30; // Add 30 min buffer for stops/delays
  return new Date(Date.now() + (hours * 60 + delayBufferMinutes) * 60 * 1000);
}

/**
 * Get truck's progress along a corridor
 */
export function getTruckProgress(
  truckId: string,
  corridorId: string
): {
  truckId: string;
  corridorName: string;
  progressPercentage: number;
  currentLocation: TruckLocation | null;
  nextCity: string;
  distanceCovered: number;
  distanceRemaining: number;
  estimatedArrival: Date;
} | null {
  const corridor = FREIGHT_CORRIDORS.find((c) => c.id === corridorId);
  if (!corridor) return null;

  // Simulate truck started 6 hours ago
  const journeyStart = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const currentLocation = getTruckLocationOnRoute(truckId, corridor.waypoints, journeyStart, 70);

  if (!currentLocation) return null;

  const progressPercentage = Math.round(
    ((corridor.distance - currentLocation.distanceToDestination) / corridor.distance) * 100
  );

  return {
    truckId,
    corridorName: corridor.name,
    progressPercentage,
    currentLocation,
    nextCity: currentLocation.nextWaypoint?.city || 'Final Destination',
    distanceCovered: corridor.distance - currentLocation.distanceToDestination,
    distanceRemaining: currentLocation.distanceToDestination,
    estimatedArrival: currentLocation.estimatedArrival,
  };
}

/**
 * Validate GPS coordinates
 */
export function validateCoordinates(
  latitude: number,
  longitude: number
): { valid: boolean; error?: string } {
  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { valid: true };
}

/**
 * Format GPS update for API transmission
 */
export function formatGPSUpdate(update: GPSUpdate): Record<string, any> {
  return {
    truckId: update.truckId,
    shipmentId: update.shipmentId,
    fleetId: update.fleetId,
    latitude: Math.round(update.latitude * 100000) / 100000,
    longitude: Math.round(update.longitude * 100000) / 100000,
    accuracy: update.accuracy ? Math.round(update.accuracy) : undefined,
    heading: update.heading ? Math.round(update.heading * 10) / 10 : undefined,
    speed: Math.round(update.speed * 10) / 10,
    altitude: update.altitude ? Math.round(update.altitude) : undefined,
    batteryLevel: update.batteryLevel ? Math.round(update.batteryLevel) : undefined,
    isOfflineData: update.isOfflineData || false,
    timestamp: update.timestamp,
  };
}

/**
 * Generate GPX XML for a journey (for testing/export)
 */
export function generateGPXTrack(
  truckId: string,
  corridor: {
    name: string;
    waypoints: Array<{ city: string; latitude: number; longitude: number }>;
  },
  journeyStartTime: Date = new Date()
): string {
  const updates = simulateTruckJourney(truckId, corridor.waypoints, journeyStartTime, 70, 3600);

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GoTruck Tracking"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  
  <metadata>
    <name>${corridor.name}</name>
    <desc>Truck ${truckId} journey simulation</desc>
    <time>${journeyStartTime.toISOString()}</time>
  </metadata>
  
  <trk>
    <name>Truck ${truckId} Route</name>
    <type>journey</type>
    
    <trkseg>`;

  updates.forEach((update) => {
    gpx += `
      <trkpt lat="${update.latitude}" lon="${update.longitude}">
        <ele>${update.altitude || 1000}</ele>
        <time>${new Date(update.timestamp).toISOString()}</time>
        <extensions>
          <speed>${update.speed}</speed>
          <heading>${update.heading || 0}</heading>
          <accuracy>${update.accuracy || 10}</accuracy>
        </extensions>
      </trkpt>`;
  });

  gpx += `
    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

/**
 * Get nearby waypoints for a location
 */
export function getNearbyWaypoints(
  latitude: number,
  longitude: number,
  maxDistance: number = 100 // km
) {
  const nearby = [];

  Object.values(MAJOR_CITIES).forEach((city) => {
    const distance = calculateDistance(latitude, longitude, city.latitude, city.longitude);
    if (distance <= maxDistance) {
      nearby.push({
        ...city,
        distance,
      });
    }
  });

  return nearby.sort((a, b) => a.distance - b.distance);
}

/**
 * Calculate fuel consumption estimate
 */
export function estimateFuelConsumption(
  distanceKm: number,
  vehicleType: string = 'truck',
  fuelType: string = 'diesel'
): {
  distance: number;
  consumption: number; // liters
  cost: number; // KES estimate
} {
  const fuelConsumption: Record<string, Record<string, number>> = {
    truck: {
      diesel: 0.25, // liters per km
      petrol: 0.35,
      gas: 0.3,
    },
    van: {
      diesel: 0.15,
      petrol: 0.20,
      gas: 0.18,
    },
    pickup: {
      diesel: 0.12,
      petrol: 0.18,
      gas: 0.15,
    },
  };

  const consumptionRate = fuelConsumption[vehicleType]?.[fuelType] || 0.25;
  const consumption = distanceKm * consumptionRate;

  // Approximate diesel price in EAC (KES per liter)
  const fuelPrice = fuelType === 'diesel' ? 120 : 130; // Simplified
  const cost = consumption * fuelPrice;

  return {
    distance: distanceKm,
    consumption: Math.round(consumption * 10) / 10,
    cost: Math.round(cost),
  };
}

/**
 * Generate summary report for a shipment
 */
export function getShipmentSummary(shipmentId: string) {
  const shipment = SAMPLE_SHIPMENTS.find((s) => s.id === shipmentId);
  if (!shipment) return null;

  const truck = SAMPLE_TRUCKS.find((t) => t.id === shipment.carrier.truckId);
  const corridor = FREIGHT_CORRIDORS.find((c) =>
    c.waypoints.some((w) => w.city === shipment.destination.city)
  );

  const distance = corridor?.distance || 0;
  const fuelInfo = estimateFuelConsumption(distance, truck?.vehicleType || 'truck');

  return {
    shipment,
    truck,
    corridor,
    fuelEstimate: fuelInfo,
    status: {
      current: shipment.status,
      isDelivered: shipment.status === 'delivered',
      isInProgress:
        shipment.status === 'in_transit' ||
        shipment.status === 'picked_up' ||
        shipment.status === 'customs',
    },
    timeline: {
      created: shipment.createdAt,
      pickup: shipment.pickupDate,
      estimatedDelivery: shipment.estimatedDeliveryDate,
      actualDelivery: shipment.actualDeliveryDate,
    },
  };
}
