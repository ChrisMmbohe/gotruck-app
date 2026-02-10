/**
 * GPS Tracking Simulator
 * Generates realistic GPS updates for vehicles moving along corridors
 */

import { FREIGHT_CORRIDORS, RouteWaypoint } from './routes';

export interface GPSUpdate {
  truckId: string;
  shipmentId?: string;
  fleetId?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed: number; // km/h
  altitude?: number;
  batteryLevel?: number;
  isOfflineData?: boolean;
  timestamp: number;
}

export interface TruckLocation {
  truckId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  destination: string;
  nextWaypoint?: RouteWaypoint;
  distanceToDestination: number;
  estimatedArrival: Date;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate heading (bearing) between two points
 */
export function calculateHeading(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = lon2 - lon1;
  const y = Math.sin((dLon * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos((dLon * Math.PI) / 180);
  const heading = (Math.atan2(y, x) * 180) / Math.PI;
  return (heading + 360) % 360; // Normalize to 0-360
}

/**
 * Interpolate position between two waypoints
 */
export function interpolatePosition(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  progress: number // 0 to 1
): [number, number] {
  return [lat1 + (lat2 - lat1) * progress, lon1 + (lon2 - lon1) * progress];
}

/**
 * Generate GPS updates for a truck moving along a corridor
 */
export function generateGPSUpdate(
  truckId: string,
  currentLat: number,
  currentLng: number,
  destinationLat: number,
  destinationLng: number,
  speed: number = 60,
  timestamp?: number
): GPSUpdate {
  const heading = calculateHeading(currentLat, currentLng, destinationLat, destinationLng);
  const distance = calculateDistance(currentLat, currentLng, destinationLat, destinationLng);

  // Add some realistic variation to coordinates (a few meters)
  const variation = 0.0001; // ~10 meters at equator
  const lat = currentLat + (Math.random() - 0.5) * variation;
  const lng = currentLng + (Math.random() - 0.5) * variation;

  return {
    truckId,
    latitude: lat,
    longitude: lng,
    accuracy: Math.random() * 10 + 5, // 5-15 meters
    heading: heading + (Math.random() - 0.5) * 10, // ±5 degrees variation
    speed: Math.max(0, speed + (Math.random() - 0.5) * 10), // ±5 km/h variation
    altitude: Math.random() * 500 + 1000, // 1000-1500 meters
    batteryLevel: Math.random() * 20 + 70, // 70-90%
    isOfflineData: false,
    timestamp: timestamp || Date.now(),
  };
}

/**
 * Simulate truck movement along a route
 * Returns a series of GPS updates that simulate progressive movement
 */
export function simulateTruckJourney(
  truckId: string,
  waypoints: RouteWaypoint[],
  journeyStartTime: Date = new Date(),
  speedKmh: number = 60,
  updateIntervalSeconds: number = 300 // Every 5 minutes
): GPSUpdate[] {
  const updates: GPSUpdate[] = [];

  // Total distance
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(
      waypoints[i].latitude,
      waypoints[i].longitude,
      waypoints[i + 1].latitude,
      waypoints[i + 1].longitude
    );
  }

  // Total journey time in seconds
  const totalTimeSeconds = (totalDistance / speedKmh) * 3600;

  // Number of updates during journey
  const numUpdates = Math.ceil(totalTimeSeconds / updateIntervalSeconds);
  let currentWaypointIndex = 0;
  let distanceCovered = 0;

  for (let i = 0; i < numUpdates; i++) {
    const timeOffset = i * updateIntervalSeconds * 1000; // ms
    const timestamp = journeyStartTime.getTime() + timeOffset;

    // Find current position along route
    let remainingDistance = (speedKmh * updateIntervalSeconds) / 3600; // km

    while (
      currentWaypointIndex < waypoints.length - 1 &&
      remainingDistance > 0
    ) {
      const currentWaypoint = waypoints[currentWaypointIndex];
      const nextWaypoint = waypoints[currentWaypointIndex + 1];

      const segmentDistance = calculateDistance(
        currentWaypoint.latitude,
        currentWaypoint.longitude,
        nextWaypoint.latitude,
        nextWaypoint.longitude
      );

      if (remainingDistance >= segmentDistance) {
        // Move to next waypoint
        remainingDistance -= segmentDistance;
        distanceCovered += segmentDistance;
        currentWaypointIndex++;
      } else {
        // Interpolate within segment
        const progress = remainingDistance / segmentDistance;
        const [lat, lng] = interpolatePosition(
          currentWaypoint.latitude,
          currentWaypoint.longitude,
          nextWaypoint.latitude,
          nextWaypoint.longitude,
          progress
        );

        const update = generateGPSUpdate(
          truckId,
          lat,
          lng,
          nextWaypoint.latitude,
          nextWaypoint.longitude,
          speedKmh,
          timestamp
        );

        // Adjust heading to face towards next waypoint
        update.heading = calculateHeading(lat, lng, nextWaypoint.latitude, nextWaypoint.longitude);

        updates.push(update);
        break;
      }
    }

    // If we've reached the final waypoint
    if (currentWaypointIndex === waypoints.length - 1) {
      const finalWaypoint = waypoints[waypoints.length - 1];
      const update = generateGPSUpdate(
        truckId,
        finalWaypoint.latitude,
        finalWaypoint.longitude,
        finalWaypoint.latitude,
        finalWaypoint.longitude,
        0, // Stop
        timestamp
      );
      updates.push(update);
      break;
    }
  }

  return updates;
}

/**
 * Create realistic GPS updates for idle trucks with slight GPS drift
 */
export function generateIdleGPSUpdates(
  truckId: string,
  baseLat: number,
  baseLng: number,
  numUpdates: number = 12,
  intervalMinutes: number = 5
): GPSUpdate[] {
  const updates: GPSUpdate[] = [];
  const drift = 0.00005; // ~5 meters

  for (let i = 0; i < numUpdates; i++) {
    const timestamp = Date.now() + i * intervalMinutes * 60 * 1000;

    updates.push({
      truckId,
      latitude: baseLat + (Math.random() - 0.5) * drift,
      longitude: baseLng + (Math.random() - 0.5) * drift,
      accuracy: Math.random() * 5 + 3, // Very accurate
      heading: undefined,
      speed: 0,
      altitude: 1000 + Math.random() * 100,
      batteryLevel: 100 - Math.random() * 10, // 90-100%
      isOfflineData: false,
      timestamp,
    });
  }

  return updates;
}

/**
 * Create a batch of GPS updates simulating multiple trucks
 */
export function generateBatchGPSUpdates(
  trucks: Array<{
    id: string;
    lat: number;
    lng: number;
  }>,
  destinationLat: number,
  destinationLng: number,
  speedKmh: number = 65
): GPSUpdate[] {
  const updates: GPSUpdate[] = [];
  const timestamp = Date.now();

  trucks.forEach((truck) => {
    const update = generateGPSUpdate(
      truck.id,
      truck.lat,
      truck.lng,
      destinationLat,
      destinationLng,
      speedKmh,
      timestamp
    );
    updates.push(update);
  });

  return updates;
}

/**
 * Get current location of truck based on journey progress
 */
export function getTruckLocationOnRoute(
  truckId: string,
  waypoints: RouteWaypoint[],
  journeyStartTime: Date,
  speedKmh: number = 60
): TruckLocation | null {
  if (waypoints.length < 2) return null;

  const now = new Date();
  const elapsedSeconds = (now.getTime() - journeyStartTime.getTime()) / 1000;
  const distanceKm = (speedKmh * elapsedSeconds) / 3600;

  let totalDistance = 0;
  let currentWaypointIndex = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segmentDistance = calculateDistance(
      waypoints[i].latitude,
      waypoints[i].longitude,
      waypoints[i + 1].latitude,
      waypoints[i + 1].longitude
    );

    if (totalDistance + segmentDistance >= distanceKm) {
      currentWaypointIndex = i;
      break;
    }

    totalDistance += segmentDistance;
  }

  const currentWaypoint = waypoints[currentWaypointIndex];
  const nextWaypoint = waypoints[Math.min(currentWaypointIndex + 1, waypoints.length - 1)];

  const segmentDistance = calculateDistance(
    currentWaypoint.latitude,
    currentWaypoint.longitude,
    nextWaypoint.latitude,
    nextWaypoint.longitude
  );

  const remainingInSegment = distanceKm - totalDistance;
  const progress = Math.min(remainingInSegment / segmentDistance, 1);

  const [lat, lng] = interpolatePosition(
    currentWaypoint.latitude,
    currentWaypoint.longitude,
    nextWaypoint.latitude,
    nextWaypoint.longitude,
    progress
  );

  const heading = calculateHeading(lat, lng, nextWaypoint.latitude, nextWaypoint.longitude);

  // Calculate remaining distance to final destination
  const finalDestination = waypoints[waypoints.length - 1];
  const remainingDistance = calculateDistance(lat, lng, finalDestination.latitude, finalDestination.longitude);

  // Estimate arrival time
  const remainingHours = remainingDistance / speedKmh;
  const estimatedArrival = new Date(now.getTime() + remainingHours * 3600 * 1000);

  return {
    truckId,
    latitude: lat,
    longitude: lng,
    heading,
    speed: speedKmh,
    destination: finalDestination.city,
    nextWaypoint,
    distanceToDestination: remainingDistance,
    estimatedArrival,
  };
}
