import * as turf from '@turf/turf';
import { Point, Polygon, Feature, FeatureCollection } from '@turf/turf';

/**
 * Geofence types
 */
export interface Geofence {
  id: string;
  name: string;
  type: 'polygon' | 'circle';
  coordinates: number[][][] | number[][];
  radius?: number; // For circle geofences in meters
  center?: [number, number];
  properties?: Record<string, any>;
}

/**
 * Geofence event
 */
export interface GeofenceEvent {
  geofenceId: string;
  geofenceName: string;
  truckId: string;
  shipmentId?: string;
  eventType: 'entered' | 'exited';
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

/**
 * Detects if a point is inside a polygon using ray-casting algorithm (Turf.js)
 */
export function isPointInPolygon(
  latitude: number,
  longitude: number,
  geofence: Geofence
): boolean {
  try {
    const point: Point = turf.point([longitude, latitude]);
    
    if (geofence.type === 'polygon') {
      const polygon: Polygon = turf.polygon(geofence.coordinates as number[][][]);
      return turf.booleanPointInPolygon(point, polygon);
    } else if (geofence.type === 'circle' && geofence.center && geofence.radius) {
      // For circles, use turf.distance and radius
      const center = turf.point(geofence.center);
      const distance = turf.distance(point, center, { units: 'meters' });
      return distance <= geofence.radius;
    }
    
    return false;
  } catch (error) {
    console.error('Geofence detection error:', error);
    return false;
  }
}

/**
 * Detects multiple geofences for a single point
 */
export function detectGeofences(
  latitude: number,
  longitude: number,
  geofences: Geofence[]
): string[] {
  return geofences
    .filter((geofence) => isPointInPolygon(latitude, longitude, geofence))
    .map((geofence) => geofence.id);
}

/**
 * Calculates distance from point to geofence
 */
export function distanceToGeofence(
  latitude: number,
  longitude: number,
  geofence: Geofence
): number {
  try {
    const point: Point = turf.point([longitude, latitude]);

    if (geofence.type === 'circle' && geofence.center) {
      const center = turf.point(geofence.center);
      const distance = turf.distance(point, center, { units: 'meters' });
      if (geofence.radius) {
        return Math.max(0, distance - geofence.radius);
      }
      return distance;
    } else if (geofence.type === 'polygon') {
      // Calculate nearest point on polygon to the point
      const polygon: Polygon = turf.polygon(geofence.coordinates as number[][][]);
      const nearestPointOnPolygon = turf.nearestPointOnLine(point, polygon);
      return turf.distance(point, nearestPointOnPolygon, { units: 'meters' });
    }

    return Infinity;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return Infinity;
  }
}

/**
 * Calculates bearing (direction) between two points
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const from = turf.point([lng1, lat1]);
  const to = turf.point([lng2, lat2]);
  return turf.bearing(from, to);
}

/**
 * Calculates distance between two points
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  unit: 'meters' | 'kilometers' | 'miles' = 'meters'
): number {
  const from = turf.point([lng1, lat1]);
  const to = turf.point([lng2, lat2]);

  const units: any = unit === 'miles' ? 'miles' : unit === 'kilometers' ? 'kilometers' : 'meters';
  return turf.distance(from, to, { units });
}

/**
 * Creates a buffer (circle) around a point
 */
export function createBuffer(
  latitude: number,
  longitude: number,
  radiusInMeters: number
): Polygon {
  const center: Point = turf.point([longitude, latitude]);
  const radiusInKm = radiusInMeters / 1000;
  return turf.buffer(center, radiusInKm, { units: 'kilometers' });
}

/**
 * Checks if geofence is within a certain area
 */
export function isGeofenceNearby(
  latitude: number,
  longitude: number,
  geofence: Geofence,
  bufferMeters = 500
): boolean {
  const distance = distanceToGeofence(latitude, longitude, geofence);
  return distance <= bufferMeters;
}

/**
 * Gets all geofences within a certain distance
 */
export function getNearbyGeofences(
  latitude: number,
  longitude: number,
  geofences: Geofence[],
  radiusMeters = 5000
): Array<{ geofence: Geofence; distance: number }> {
  return geofences
    .map((geofence) => ({
      geofence,
      distance: distanceToGeofence(latitude, longitude, geofence),
    }))
    .filter((item) => item.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Validates geofence coordinates
 */
export function validateGeofenceCoordinates(geofence: Geofence): boolean {
  try {
    if (geofence.type === 'polygon') {
      const polygon: Polygon = turf.polygon(geofence.coordinates as number[][][]);
      // Check if polygon is valid
      if (geofence.coordinates[0].length < 3) {
        console.error('Polygon must have at least 3 vertices');
        return false;
      }
      return true;
    } else if (geofence.type === 'circle') {
      if (!geofence.center || !geofence.radius) {
        console.error('Circle must have center and radius');
        return false;
      }
      if (geofence.radius <= 0) {
        console.error('Radius must be greater than 0');
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Geofence validation error:', error);
    return false;
  }
}
