import { Geofence, GeofenceEvent } from './detector';
import { isPointInPolygon, detectGeofences } from './detector';

/**
 * Border crossing state tracker
 */
export interface BorderCrossingState {
  truckId: string;
  currentGeofences: Set<string>;
  previousGeofences: Set<string>;
  lastUpdate: number;
}

/**
 * Stores border crossing state for trucks (in-memory or Redis)
 */
const borderStateMap = new Map<string, BorderCrossingState>();

/**
 * Initializes border crossing state for a truck
 */
export function initializeBorderState(truckId: string, geofenceIds: string[] = []): void {
  if (!borderStateMap.has(truckId)) {
    borderStateMap.set(truckId, {
      truckId,
      currentGeofences: new Set(geofenceIds),
      previousGeofences: new Set(),
      lastUpdate: Date.now(),
    });
  }
}

/**
 * Detects border crossings and returns events
 */
export function detectBorderCrossings(
  truckId: string,
  latitude: number,
  longitude: number,
  geofences: Geofence[],
  shipmentId?: string
): GeofenceEvent[] {
  const events: GeofenceEvent[] = [];

  // Initialize state if not exists
  if (!borderStateMap.has(truckId)) {
    initializeBorderState(truckId);
  }

  const state = borderStateMap.get(truckId)!;

  // Detect current geofences
  const currentGeofenceIds = detectGeofences(latitude, longitude, geofences);
  const currentGeofencesSet = new Set(currentGeofenceIds);

  // Find entered geofences (not in previous, but in current)
  currentGeofencesSet.forEach((geofenceId) => {
    if (!state.previousGeofences.has(geofenceId)) {
      const geofence = geofences.find((g) => g.id === geofenceId);
      if (geofence) {
        events.push({
          geofenceId,
          geofenceName: geofence.name,
          truckId,
          shipmentId,
          eventType: 'entered',
          location: { latitude, longitude },
          timestamp: Date.now(),
        });
      }
    }
  });

  // Find exited geofences (in previous, but not in current)
  state.previousGeofences.forEach((geofenceId) => {
    if (!currentGeofencesSet.has(geofenceId)) {
      const geofence = geofences.find((g) => g.id === geofenceId);
      if (geofence) {
        events.push({
          geofenceId,
          geofenceName: geofence.name,
          truckId,
          shipmentId,
          eventType: 'exited',
          location: { latitude, longitude },
          timestamp: Date.now(),
        });
      }
    }
  });

  // Update state
  state.previousGeofences = state.currentGeofences;
  state.currentGeofences = currentGeofencesSet;
  state.lastUpdate = Date.now();

  return events;
}

/**
 * Gets current geofence state for a truck
 */
export function getTruckGeofenceState(truckId: string): BorderCrossingState | undefined {
  return borderStateMap.get(truckId);
}

/**
 * Gets all trucks currently in a geofence
 */
export function getTrucksInGeofence(geofenceId: string): string[] {
  const trucks: string[] = [];

  borderStateMap.forEach((state) => {
    if (state.currentGeofences.has(geofenceId)) {
      trucks.push(state.truckId);
    }
  });

  return trucks;
}

/**
 * Clears stale border states (trucks inactive for > 24 hours)
 */
export function clearStaleBorderStates(maxAgeMs = 24 * 60 * 60 * 1000): number {
  let clearedCount = 0;
  const now = Date.now();

  borderStateMap.forEach((state, truckId) => {
    if (now - state.lastUpdate > maxAgeMs) {
      borderStateMap.delete(truckId);
      clearedCount++;
    }
  });

  return clearedCount;
}

/**
 * Resets border state for a specific truck
 */
export function resetBorderState(truckId: string): void {
  borderStateMap.delete(truckId);
}

/**
 * Clears all border states
 */
export function clearAllBorderStates(): void {
  borderStateMap.clear();
}

/**
 * Gets statistics about current border states
 */
export function getBorderStateStats(): {
  totalTrucks: number;
  averageGeofencesPerTruck: number;
  oldestStateAge: number;
} {
  if (borderStateMap.size === 0) {
    return {
      totalTrucks: 0,
      averageGeofencesPerTruck: 0,
      oldestStateAge: 0,
    };
  }

  let totalGeofences = 0;
  let oldestTime = Date.now();

  borderStateMap.forEach((state) => {
    totalGeofences += state.currentGeofences.size;
    oldestTime = Math.min(oldestTime, state.lastUpdate);
  });

  return {
    totalTrucks: borderStateMap.size,
    averageGeofencesPerTruck: totalGeofences / borderStateMap.size,
    oldestStateAge: Date.now() - oldestTime,
  };
}
