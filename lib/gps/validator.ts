import { z } from 'zod';

/**
 * GPS Update validation schema
 */
export const GPSUpdateSchema = z.object({
  truckId: z.string().min(1, 'Truck ID is required'),
  shipmentId: z.string().optional(),
  fleetId: z.string().optional(),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  accuracy: z.number().min(0).optional(),
  heading: z
    .number()
    .min(0)
    .max(360)
    .optional(),
  speed: z.number().min(0).optional(),
  altitude: z.number().optional(),
  batteryLevel: z
    .number()
    .min(0)
    .max(100)
    .optional(),
  isOfflineData: z.boolean().default(false),
  timestamp: z.number().optional(),
});

/**
 * Batch GPS updates schema
 */
export const GPSBatchSchema = z.object({
  updates: z.array(GPSUpdateSchema),
  userId: z.string().optional(),
});

/**
 * Geofence query schema
 */
export const GeofenceQuerySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  maxDistance: z.number().min(0).default(50000), // meters
});

export type GPSUpdate = z.infer<typeof GPSUpdateSchema>;
export type GPSBatch = z.infer<typeof GPSBatchSchema>;
export type GeofenceQuery = z.infer<typeof GeofenceQuerySchema>;

/**
 * Validates a single GPS update
 */
export function validateGPSUpdate(data: unknown): { valid: boolean; data?: GPSUpdate; error?: string } {
  try {
    const validated = GPSUpdateSchema.parse(data);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { valid: false, error: message };
    }
    return { valid: false, error: 'Invalid GPS data' };
  }
}

/**
 * Validates batch GPS updates
 */
export function validateGPSBatch(data: unknown): { valid: boolean; data?: GPSBatch; error?: string } {
  try {
    const validated = GPSBatchSchema.parse(data);
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { valid: false, error: message };
    }
    return { valid: false, error: 'Invalid GPS batch data' };
  }
}

/**
 * Checks if coordinates are suspiciously far from previous location
 * Helps detect GPS spoofing or errors
 */
export function isLocationSuspicious(
  previousLat: number,
  previousLng: number,
  newLat: number,
  newLng: number,
  maxKmPer5Sec = 20 // Max speed: 20km in 5 seconds (unlikely for truck)
): boolean {
  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = ((newLat - previousLat) * Math.PI) / 180;
  const dLng = ((newLng - previousLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((previousLat * Math.PI) / 180) *
      Math.cos((newLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance > maxKmPer5Sec;
}

/**
 * Normalizes GPS coordinates to ensure valid range
 */
export function normalizeCoordinates(lat: number, lng: number): [number, number] {
  // Constrain latitude
  let normalizedLat = Math.max(-90, Math.min(90, lat));

  // Handle longitude wraparound
  let normalizedLng = lng;
  while (normalizedLng > 180) {
    normalizedLng -= 360;
  }
  while (normalizedLng < -180) {
    normalizedLng += 360;
  }

  return [normalizedLat, normalizedLng];
}

/**
 * Validates accuracy threshold
 */
export function isAccuracyAcceptable(accuracy: number, threshold = 100): boolean {
  return accuracy <= threshold;
}
