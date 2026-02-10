/**
 * API Route: /api/demo/tracking
 * Provides sample tracking data and GPS simulation for testing
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  SAMPLE_TRUCKS,
  SAMPLE_SHIPMENTS,
  FREIGHT_CORRIDORS,
  MAJOR_CITIES,
} from '@/lib/sample-data/trucks';
import {
  generateGPSUpdate,
  simulateTruckJourney,
  getTruckLocationOnRoute,
  generateIdleGPSUpdates,
  calculateDistance,
} from '@/lib/sample-data/gps-simulator';
import { getCorridorById } from '@/lib/sample-data/routes';

/**
 * GET /api/demo/tracking
 *
 * Query params:
 * - action: 'trucks' | 'shipments' | 'corridors' | 'gps-update' | 'journey' | 'idle'
 * - truckId: (optional) specific truck ID
 * - corridorId: (optional) specific corridor ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'trucks';
    const truckId = searchParams.get('truckId');
    const corridorId = searchParams.get('corridorId');

    let data;

    switch (action) {
      case 'trucks': {
        data = truckId
          ? SAMPLE_TRUCKS.find((t) => t.id === truckId)
          : SAMPLE_TRUCKS;
        break;
      }

      case 'shipments': {
        data = truckId
          ? SAMPLE_SHIPMENTS.filter((s) => s.carrier.truckId === truckId)
          : SAMPLE_SHIPMENTS.slice(0, 5); // Limit response
        break;
      }

      case 'corridors': {
        data = corridorId
          ? getCorridorById(corridorId)
          : FREIGHT_CORRIDORS;
        break;
      }

      case 'gps-update': {
        // Generate a single GPS update for a random truck
        if (!truckId) {
          return NextResponse.json(
            {
              success: false,
              error: 'truckId is required for gps-update action',
              data: null,
              meta: {},
            },
            { status: 400 }
          );
        }

        const truck = SAMPLE_TRUCKS.find((t) => t.id === truckId);
        if (!truck) {
          return NextResponse.json(
            {
              success: false,
              error: 'Truck not found',
              data: null,
              meta: {},
            },
            { status: 404 }
          );
        }

        // Get a nearby destination for realistic movement
        const destinations = [
          { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
          { name: 'Kampala', lat: 0.3476, lng: 32.5825 },
          { name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083 },
          { name: 'Kigali', lat: -1.9536, lng: 30.0606 },
        ];
        const randomDest = destinations[Math.floor(Math.random() * destinations.length)];

        const speedKmh = truck.status === 'in_transit' ? 60 + Math.random() * 20 : 0;

        const gpsUpdate = generateGPSUpdate(
          truck.id,
          truck.lastLatitude,
          truck.lastLongitude,
          randomDest.lat,
          randomDest.lng,
          speedKmh
        );

        data = gpsUpdate;
        break;
      }

      case 'journey': {
        // Simulate a truck's journey along a corridor
        if (!truckId || !corridorId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Both truckId and corridorId are required for journey action',
              data: null,
              meta: {},
            },
            { status: 400 }
          );
        }

        const corridor = getCorridorById(corridorId);
        const truck = SAMPLE_TRUCKS.find((t) => t.id === truckId);

        if (!corridor || !truck) {
          return NextResponse.json(
            {
              success: false,
              error: 'Truck or corridor not found',
              data: null,
              meta: {},
            },
            { status: 404 }
          );
        }

        // Simulate journey with GPS updates every 1 hour
        const journeyStartTime = new Date(Date.now() - 6 * 60 * 60 * 1000); // Started 6 hours ago
        const updates = simulateTruckJourney(
          truck.id,
          corridor.waypoints,
          journeyStartTime,
          70, // 70 km/h
          3600 // 1 hour intervals
        );

        // Calculate current location
        const currentLocation = getTruckLocationOnRoute(
          truck.id,
          corridor.waypoints,
          journeyStartTime,
          70
        );

        data = {
          journey: {
            truckId: truck.id,
            trucksDetails: truck,
            corridor: corridor.name,
            startTime: journeyStartTime,
            stopCount: updates.length,
            currentLocation,
            recentUpdates: updates.slice(-5), // Last 5 updates
            fullUpdatesCount: updates.length,
          },
        };
        break;
      }

      case 'idle': {
        // Generate idle GPS updates (slight drift)
        if (!truckId) {
          return NextResponse.json(
            {
              success: false,
              error: 'truckId is required for idle action',
              data: null,
              meta: {},
            },
            { status: 400 }
          );
        }

        const truck = SAMPLE_TRUCKS.find((t) => t.id === truckId);
        if (!truck) {
          return NextResponse.json(
            {
              success: false,
              error: 'Truck not found',
              data: null,
              meta: {},
            },
            { status: 404 }
          );
        }

        const idleUpdates = generateIdleGPSUpdates(
          truck.id,
          truck.lastLatitude,
          truck.lastLongitude,
          6,
          30 // 30 minute intervals
        );

        data = {
          truckId: truck.id,
          status: 'idle',
          location: {
            latitude: truck.lastLatitude,
            longitude: truck.lastLongitude,
          },
          updates: idleUpdates,
        };
        break;
      }

      case 'statistics': {
        // Get fleet statistics
        const activeCount = SAMPLE_TRUCKS.filter((t) => t.status === 'in_transit').length;
        const idleCount = SAMPLE_TRUCKS.filter((t) => t.status === 'idle').length;
        const maintenanceCount = SAMPLE_TRUCKS.filter((t) => t.status === 'maintenance').length;

        const activeShipments = SAMPLE_SHIPMENTS.filter(
          (s) => s.status === 'in_transit' || s.status === 'picked_up'
        ).length;
        const deliveredShipments = SAMPLE_SHIPMENTS.filter((s) => s.status === 'delivered').length;

        data = {
          fleet: {
            total: SAMPLE_TRUCKS.length,
            active: activeCount,
            idle: idleCount,
            maintenance: maintenanceCount,
          },
          shipments: {
            active: activeShipments,
            delivered: deliveredShipments,
            total: SAMPLE_SHIPMENTS.length,
          },
          corridors: FREIGHT_CORRIDORS.length,
          cities: Object.keys(MAJOR_CITIES).length,
        };
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            data: null,
            meta: {
              availableActions: [
                'trucks',
                'shipments',
                'corridors',
                'gps-update',
                'journey',
                'idle',
                'statistics',
              ],
            },
          },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        error: null,
        meta: {
          action,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        data: null,
        meta: {},
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/demo/tracking
 * Simulate GPS updates and send to tracking system
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, truckId, corridorId, speed = 65, count = 10 } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: 'action is required',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    let data;

    if (action === 'batch-gps-updates') {
      // Generate batch GPS updates for multiple trucks
      if (!Array.isArray(truckId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'truckId must be an array for batch-gps-updates',
            data: null,
            meta: {},
          },
          { status: 400 }
        );
      }

      const updates = truckId.map((id: string) => {
        const truck = SAMPLE_TRUCKS.find((t) => t.id === id);
        if (!truck) return null;

        const destinations = [
          { lat: -1.2921, lng: 36.8219 },
          { lat: 0.3476, lng: 32.5825 },
          { lat: -6.7924, lng: 39.2083 },
        ];
        const randomDest = destinations[Math.floor(Math.random() * destinations.length)];

        return generateGPSUpdate(
          truck.id,
          truck.lastLatitude,
          truck.lastLongitude,
          randomDest.lat,
          randomDest.lng,
          speed
        );
      }).filter(Boolean);

      data = {
        updatesCount: updates.length,
        updates: updates.slice(0, 20), // Return first 20
        fullCount: updates.length,
      };
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown POST action: ${action}`,
          data: null,
          meta: { availableActions: ['batch-gps-updates'] },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        error: null,
        meta: {
          action,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        data: null,
        meta: {},
      },
      { status: 500 }
    );
  }
}
