/**
 * Sample Data Usage Examples
 * This document shows practical examples of using the tracking sample data
 */

// ============================================================================
// 1. BASIC IMPORTS
// ============================================================================

import {
  SAMPLE_TRUCKS,
  SAMPLE_SHIPMENTS,
  FREIGHT_CORRIDORS,
  MAJOR_CITIES,
} from '@/lib/sample-data';

import {
  generateGPSUpdate,
  simulateTruckJourney,
  getTruckLocationOnRoute,
  calculateDistance,
  generateIdleGPSUpdates,
} from '@/lib/sample-data/gps-simulator';

import {
  getFleetUtilization,
  getTruckProgress,
  generateTrackingNumber,
  estimateFuelConsumption,
  getShipmentSummary,
} from '@/lib/sample-data/utils';

// ============================================================================
// 2. EXAMPLE 1: Display Fleet Overview
// ============================================================================

export function FleetOverviewExample() {
  const trucks = SAMPLE_TRUCKS;
  const utilization = getFleetUtilization();

  const activeTrucks = trucks.filter((t) => t.status === 'in_transit');
  const idleTrucks = trucks.filter((t) => t.status === 'idle');

  return {
    summary: {
      totalFleet: trucks.length,
      activeVehicles: activeTrucks.length,
      idleVehicles: idleTrucks.length,
      utilizationPercentage: utilization.percentage,
    },
    details: trucks.map((truck) => ({
      id: truck.id,
      plate: truck.plateNumber,
      driver: truck.assignedDriver?.name,
      status: truck.status,
      destination: truck.destination,
      lastLocation: {
        lat: truck.lastLatitude,
        lng: truck.lastLongitude,
      },
    })),
  };
}

// ============================================================================
// 3. EXAMPLE 2: Real-time GPS Tracking
// ============================================================================

export async function RealTimeTrackingExample(truckId: string) {
  const truck = SAMPLE_TRUCKS.find((t) => t.id === truckId);
  if (!truck) return null;

  // Generate a single GPS update
  const destinations = [
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { name: 'Kampala', lat: 0.3476, lng: 32.5825 },
    { name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083 },
  ];
  const dest = destinations[0];

  const gpsUpdate = generateGPSUpdate(
    truck.id,
    truck.lastLatitude,
    truck.lastLongitude,
    dest.lat,
    dest.lng,
    70 // 70 km/h
  );

  // Send to API
  const response = await fetch('/api/gps/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gpsUpdate),
  });

  return response.json();
}

// ============================================================================
// 4. EXAMPLE 3: Journey Simulation
// ============================================================================

export function JourneySimulationExample(truckId: string, corridorId: string) {
  const corridor = FREIGHT_CORRIDORS.find((c) => c.id === corridorId);
  if (!corridor) return null;

  const journeyStartTime = new Date(Date.now() - 6 * 60 * 60 * 1000); // Started 6 hours ago

  // Get all GPS updates for the journey
  const allUpdates = simulateTruckJourney(
    truckId,
    corridor.waypoints,
    journeyStartTime,
    70, // 70 km/h
    3600 // 1 hour intervals
  );

  // Get current location
  const currentLocation = getTruckLocationOnRoute(
    truckId,
    corridor.waypoints,
    journeyStartTime,
    70
  );

  // Get progress
  const progress = getTruckProgress(truckId, corridorId);

  return {
    journey: {
      truck: SAMPLE_TRUCKS.find((t) => t.id === truckId),
      corridor: corridor.name,
      distance: corridor.distance,
      estimatedDuration: corridor.estimatedDuration,
      startTime: journeyStartTime,
      currentLocation,
      progress: progress?.progressPercentage,
      totalUpdatePoints: allUpdates.length,
      lastFiveUpdates: allUpdates.slice(-5),
    },
  };
}

// ============================================================================
// 5. EXAMPLE 4: Shipment Tracking
// ============================================================================

export function ShipmentTrackingExample(shipmentId: string) {
  const shipment = SAMPLE_SHIPMENTS.find((s) => s.id === shipmentId);
  if (!shipment) return null;

  const truck = SAMPLE_TRUCKS.find((t) => t.id === shipment.carrier.truckId);
  const summary = getShipmentSummary(shipmentId);

  // Calculate fuel estimate for the route
  const corridor = FREIGHT_CORRIDORS.find((c) =>
    c.waypoints.some((w) => w.city === shipment.destination.city)
  );
  const distance = corridor?.distance || 0;
  const fuelInfo = estimateFuelConsumption(distance, truck?.vehicleType);

  return {
    tracking: {
      shipmentNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin.city,
      destination: shipment.destination.city,
      cargo: {
        totalWeight: shipment.totalWeight,
        description: shipment.cargo.map((c) => c.description).join(', '),
        value: `${shipment.totalValue} ${shipment.currency}`,
      },
      carrier: {
        truck: truck?.plateNumber,
        driver: truck?.assignedDriver?.name,
        contact: truck?.assignedDriver?.name,
      },
      timeline: {
        pickupDate: shipment.pickupDate,
        estimatedDelivery: shipment.estimatedDeliveryDate,
        actualDelivery: shipment.actualDeliveryDate,
      },
      estimatedCosts: {
        fuel: `${fuelInfo?.cost || 0} KES`,
        consumption: `${fuelInfo?.consumption || 0} liters`,
      },
      shipper: shipment.shipper,
      consignee: shipment.consignee,
    },
  };
}

// ============================================================================
// 6. EXAMPLE 5: Distance Analysis
// ============================================================================

export function DistanceAnalysisExample() {
  const analyses = FREIGHT_CORRIDORS.map((corridor) => {
    // Calculate actual waypoint-to-waypoint distances
    let totalDistance = 0;
    const segments = [];

    for (let i = 0; i < corridor.waypoints.length - 1; i++) {
      const wp1 = corridor.waypoints[i];
      const wp2 = corridor.waypoints[i + 1];

      const segmentDistance = calculateDistance(
        wp1.latitude,
        wp1.longitude,
        wp2.latitude,
        wp2.longitude
      );

      totalDistance += segmentDistance;
      segments.push({
        from: wp1.city,
        to: wp2.city,
        distance: Math.round(segmentDistance),
      });
    }

    // Calculate travel times at different speeds
    const speeds = [50, 60, 70, 80];
    const times = speeds.map((speed) => ({
      speed: `${speed} km/h`,
      hours: Math.round((totalDistance / speed) * 10) / 10,
    }));

    return {
      corridor: corridor.name,
      bookDistance: corridor.distance,
      calculatedDistance: Math.round(totalDistance),
      segments,
      estimatedTravelTimes: times,
    };
  });

  return analyses;
}

// ============================================================================
// 7. EXAMPLE 6: Batch GPS Updates
// ============================================================================

export async function BatchGPSUpdatesExample() {
  // Generate updates for all active trucks
  const activeTrucks = SAMPLE_TRUCKS.filter((t) => t.status === 'in_transit');

  const updates = activeTrucks.map((truck) => {
    const destinations = [
      { lat: -1.2921, lng: 36.8219 },
      { lat: 0.3476, lng: 32.5825 },
      { lat: -6.7924, lng: 39.2083 },
    ];
    const dest = destinations[Math.floor(Math.random() * destinations.length)];

    return generateGPSUpdate(
      truck.id,
      truck.lastLatitude,
      truck.lastLongitude,
      dest.lat,
      dest.lng,
      70
    );
  });

  // Send batch to API
  const response = await fetch('/api/gps/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });

  return response.json();
}

// ============================================================================
// 8. EXAMPLE 7: Idle Vehicle Monitoring
// ============================================================================

export function IdleVehicleMonitoringExample() {
  const idleTrucks = SAMPLE_TRUCKS.filter((t) => t.status === 'idle');

  const monitoring = idleTrucks.map((truck) => {
    // Generate idle GPS data (with slight drift)
    const idleUpdates = generateIdleGPSUpdates(
      truck.id,
      truck.lastLatitude,
      truck.lastLongitude,
      12, // 12 updates
      30 // 30 minute intervals
    );

    return {
      truck: {
        id: truck.id,
        plate: truck.plateNumber,
        location: {
          lat: truck.lastLatitude,
          lng: truck.lastLongitude,
        },
      },
      idleSince: truck.lastUpdated,
      idleHours: Math.round((Date.now() - truck.lastUpdated.getTime()) / (1000 * 60 * 60)),
      recentGPSUpdates: idleUpdates.slice(-3),
      driftRange: {
        maxLat: Math.max(...idleUpdates.map((u) => u.latitude)),
        minLat: Math.min(...idleUpdates.map((u) => u.latitude)),
        maxLng: Math.max(...idleUpdates.map((u) => u.longitude)),
        minLng: Math.min(...idleUpdates.map((u) => u.longitude)),
      },
    };
  });

  return monitoring;
}

// ============================================================================
// 9. EXAMPLE 8: Corridor-based Analysis
// ============================================================================

export function CorridorAnalysisExample() {
  const analysis = FREIGHT_CORRIDORS.map((corridor) => {
    // Find all shipments on this corridor
    const shipmentsOnRoute = SAMPLE_SHIPMENTS.filter(
      (s) => s.destination.city === corridor.destination
    );

    // Find all trucks assigned to this corridor
    const trucksOnRoute = SAMPLE_TRUCKS.filter((t) => t.currentRoute === corridor.id);

    // Calculate utilization
    const activeShipments = shipmentsOnRoute.filter(
      (s) => s.status === 'in_transit' || s.status === 'picked_up'
    );

    return {
      corridor: corridor.name,
      distance: corridor.distance,
      estimatedDuration: corridor.estimatedDuration,
      statistics: {
        totalShipments: shipmentsOnRoute.length,
        activeShipments: activeShipments.length,
        trucksAssigned: trucksOnRoute.length,
        utilizationRate: (activeShipments.length / shipmentsOnRoute.length * 100).toFixed(2) + '%',
      },
      shipments: shipmentsOnRoute.map((s) => ({
        id: s.id,
        tracking: s.trackingNumber,
        status: s.status,
        weight: s.totalWeight,
      })),
      trucks: trucksOnRoute.map((t) => ({
        id: t.id,
        plate: t.plateNumber,
        status: t.status,
      })),
    };
  });

  return analysis;
}

// ============================================================================
// 10. EXAMPLE 9: API Demo Calls
// ============================================================================

export async function APICallExamplesExample() {
  const baseUrl = '/api/demo/tracking';

  const examples = {
    // Get all trucks
    allTrucks: async () =>
      fetch(`${baseUrl}?action=trucks`).then((r) => r.json()),

    // Get specific truck
    specificTruck: async (truckId: string) =>
      fetch(`${baseUrl}?action=trucks&truckId=${truckId}`).then((r) => r.json()),

    // Get corridors
    corridors: async () =>
      fetch(`${baseUrl}?action=corridors`).then((r) => r.json()),

    // Generate GPS update
    gpsUpdate: async (truckId: string) =>
      fetch(`${baseUrl}?action=gps-update&truckId=${truckId}`).then((r) => r.json()),

    // Get journey simulation
    journey: async (truckId: string, corridorId: string) =>
      fetch(`${baseUrl}?action=journey&truckId=${truckId}&corridorId=${corridorId}`).then((r) =>
        r.json()
      ),

    // Get idle updates
    idle: async (truckId: string) =>
      fetch(`${baseUrl}?action=idle&truckId=${truckId}`).then((r) => r.json()),

    // Get statistics
    statistics: async () =>
      fetch(`${baseUrl}?action=statistics`).then((r) => r.json()),

    // Batch updates (POST)
    batchUpdates: async (truckIds: string[]) =>
      fetch(`${baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch-gps-updates',
          truckId: truckIds,
        }),
      }).then((r) => r.json()),
  };

  return examples;
}

// ============================================================================
// 11. EXAMPLE 10: Real Component Usage
// ============================================================================

/**
 * Example React Component using sample data
 */
export function TrackingDashboardExample() {
  return {
    // Component setup
    component: `
      'use client';
      
      import { useEffect, useState } from 'react';
      import { SAMPLE_TRUCKS, SAMPLE_SHIPMENTS } from '@/lib/sample-data';
      import { getTruckProgress, getShipmentSummary } from '@/lib/sample-data/utils';
      
      export default function TrackingDashboard() {
        const [trucks, setTrucks] = useState(SAMPLE_TRUCKS);
        const [selectedTruck, setSelectedTruck] = useState(trucks[0]?.id);
        
        useEffect(() => {
          // Simulate real-time updates
          const interval = setInterval(() => {
            setTrucks(trucks => trucks.map(t => ({
              ...t,
              lastLatitude: t.lastLatitude + (Math.random() - 0.5) * 0.01,
              lastLongitude: t.lastLongitude + (Math.random() - 0.5) * 0.01,
              lastUpdated: new Date()
            })));
          }, 5000);
          
          return () => clearInterval(interval);
        }, []);
        
        return (
          <div>
            <h1>Fleet Tracking Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trucks.map(truck => (
                <div 
                  key={truck.id}
                  className="p-4 border rounded cursor-pointer"
                  onClick={() => setSelectedTruck(truck.id)}
                >
                  <div className="font-bold">{truck.plateNumber}</div>
                  <div className="text-sm">{truck.assignedDriver?.name}</div>
                  <div className="text-xs text-gray-500">{truck.status}</div>
                  <div className="text-xs">
                    {truck.destination}
                  </div>
                </div>
              ))}
            </div>
            
            {selectedTruck && (
              <ShipmentPanel shipmentId={selectedTruck} />
            )}
          </div>
        );
      }
      
      function ShipmentPanel({ shipmentId }) {
        const shipment = SAMPLE_SHIPMENTS.find(s => s.id === shipmentId);
        const summary = getShipmentSummary(shipmentId);
        
        if (!shipment) return null;
        
        return (
          <div className="mt-8 p-4 border rounded">
            <h2>{shipment.trackingNumber}</h2>
            <p>Status: {shipment.status}</p>
            <p>Weight: {shipment.totalWeight} kg</p>
            <p>Value: {shipment.totalValue} {shipment.currency}</p>
          </div>
        );
      }
    `,
  };
}

export default {
  FleetOverviewExample,
  RealTimeTrackingExample,
  JourneySimulationExample,
  ShipmentTrackingExample,
  DistanceAnalysisExample,
  BatchGPSUpdatesExample,
  IdleVehicleMonitoringExample,
  CorridorAnalysisExample,
  APICallExamplesExample,
  TrackingDashboardExample,
};
