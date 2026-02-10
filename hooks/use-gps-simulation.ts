/**
 * Hook for managing GPS simulation and real-time truck tracking
 * Simulates realistic movement along actual EAC corridors
 */

import { useEffect, useState, useRef } from 'react';
import { generateGPSUpdate, calculateDistance, calculateHeading } from '@/lib/sample-data/gps-simulator';
import { SAMPLE_TRUCKS } from '@/lib/sample-data/trucks';
import { FREIGHT_CORRIDORS } from '@/lib/sample-data/routes';

export interface TruckLocation {
  truckId: string;
  plateNumber: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
  currentRoute?: string;
  nextWaypoint?: string;
}

export interface UseGPSSimulationOptions {
  updateInterval?: number; // milliseconds
  enabled?: boolean;
}

interface TruckJourneyState {
  corridorId: string;
  waypointIndex: number;
  progress: number; // 0-1 along current segment
  speedKmh: number;
}

/**
 * Hook to simulate GPS updates for trucks in transit
 * Moves trucks realistically along actual corridors and waypoints
 */
export function useGPSSimulation(options: UseGPSSimulationOptions = {}) {
  const {
    updateInterval = 5000, // 5 seconds default
    enabled = true,
  } = options;

  const [truckLocations, setTruckLocations] = useState<Map<string, TruckLocation>>(
    new Map()
  );
  const journeyStateRef = useRef<Map<string, TruckJourneyState>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize truck locations and journeys
  useEffect(() => {
    const initialLocations = new Map<string, TruckLocation>();
    const initialJourneys = new Map<string, TruckJourneyState>();

    SAMPLE_TRUCKS.forEach((truck) => {
      initialLocations.set(truck.id, {
        truckId: truck.id,
        plateNumber: truck.plateNumber,
        latitude: truck.lastLatitude,
        longitude: truck.lastLongitude,
        speed: truck.status === 'in_transit' ? 65 : 0,
        heading: 0,
        timestamp: new Date(),
        currentRoute: truck.currentRoute,
      });

      // Assign a corridor to each in-transit truck
      if (truck.status === 'in_transit' && truck.currentRoute) {
        const corridor = FREIGHT_CORRIDORS.find(c => c.id === truck.currentRoute);
        if (corridor) {
          initialJourneys.set(truck.id, {
            corridorId: truck.currentRoute,
            waypointIndex: 0,
            progress: 0,
            speedKmh: 65 + Math.random() * 15,
          });
        }
      }
    });

    setTruckLocations(initialLocations);
    journeyStateRef.current = initialJourneys;
  }, []);

  // Simulate realistic GPS updates
  useEffect(() => {
    if (!enabled || !updateInterval) return;

    const updateGPS = () => {
      setTruckLocations((prevLocations) => {
        const newLocations = new Map(prevLocations);

        SAMPLE_TRUCKS.forEach((truck) => {
          if (truck.status !== 'in_transit') {
            // Don't update idle or maintenance trucks
            return;
          }

          const currentLocation = prevLocations.get(truck.id);
          if (!currentLocation) return;

          let journeyState = journeyStateRef.current.get(truck.id);
          if (!journeyState) {
            // Initialize journey if missing
            const corridor = FREIGHT_CORRIDORS.find(c => c.id === truck.currentRoute);
            if (!corridor) return;

            journeyState = {
              corridorId: truck.currentRoute || FREIGHT_CORRIDORS[0].id,
              waypointIndex: 0,
              progress: 0,
              speedKmh: 65 + Math.random() * 15,
            };
          }

          // Get the assigned corridor
          const corridor = FREIGHT_CORRIDORS.find(c => c.id === journeyState!.corridorId);
          if (!corridor || corridor.waypoints.length < 2) return;

          // Get current and next waypoints
          let currentWaypoint = corridor.waypoints[journeyState.waypointIndex];
          let nextWaypoint = corridor.waypoints[journeyState.waypointIndex + 1];

          // If reached final waypoint, loop back
          if (!nextWaypoint) {
            journeyState.waypointIndex = 0;
            currentWaypoint = corridor.waypoints[0];
            nextWaypoint = corridor.waypoints[1];
            journeyState.progress = 0;
          }

          // Calculate movement along this segment
          const segmentDistance = calculateDistance(
            currentWaypoint.latitude,
            currentWaypoint.longitude,
            nextWaypoint.latitude,
            nextWaypoint.longitude
          );

          // Speed in km/h, update interval in seconds
          const moveDistance = (journeyState.speedKmh / 3600) * (updateInterval / 1000);
          journeyState.progress += moveDistance / segmentDistance;

          // Move to next waypoint if progress exceeds segment
          if (journeyState.progress >= 1) {
            journeyState.progress = 0;
            journeyState.waypointIndex = Math.min(
              journeyState.waypointIndex + 1,
              corridor.waypoints.length - 1
            );

            // Vary speed slightly
            journeyState.speedKmh = 55 + Math.random() * 25; // 55-80 km/h
          }

          // Interpolate position between waypoints
          const lat = currentWaypoint.latitude + 
            (nextWaypoint.latitude - currentWaypoint.latitude) * journeyState.progress;
          const lng = currentWaypoint.longitude + 
            (nextWaypoint.longitude - currentWaypoint.longitude) * journeyState.progress;

          // Calculate realistic heading
          const heading = calculateHeading(currentWaypoint.latitude, currentWaypoint.longitude, nextWaypoint.latitude, nextWaypoint.longitude);

          // Update location with realistic movement
          newLocations.set(truck.id, {
            truckId: truck.id,
            plateNumber: truck.plateNumber,
            latitude: lat,
            longitude: lng,
            speed: journeyState.speedKmh,
            heading: heading,
            timestamp: new Date(),
            currentRoute: journeyState.corridorId,
            nextWaypoint: nextWaypoint.city,
          });

          // Save journey state
          journeyStateRef.current.set(truck.id, journeyState);
        });

        return newLocations;
      });
    };

    intervalRef.current = setInterval(updateGPS, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, updateInterval]);

  return {
    truckLocations,
  };
}
