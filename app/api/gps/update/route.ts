import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateGPSUpdate, normalizeCoordinates } from '@/lib/gps/validator';
import { createGPSLog } from '@/lib/db/models/GPSLog';
import { connectDB } from '@/lib/db/mongodb';

/**
 * POST /api/gps/update
 * 
 * Records a single GPS location update
 * Validates coordinates, stores in MongoDB, broadcasts via Socket.io
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', data: null, meta: {} },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validateGPSUpdate(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error, data: null, meta: {} },
        { status: 400 }
      );
    }

    await connectDB();

    const data = validation.data!;
    const [normalizedLat, normalizedLng] = normalizeCoordinates(
      data.latitude,
      data.longitude
    );

    // Create GPS log entry
    const gpsLog = await createGPSLog({
      truckId: data.truckId,
      shipmentId: data.shipmentId,
      fleetId: data.fleetId,
      userId,
      latitude: normalizedLat,
      longitude: normalizedLng,
      accuracy: data.accuracy,
      heading: data.heading,
      speed: data.speed,
      altitude: data.altitude,
      batteryLevel: data.batteryLevel,
      isOfflineData: data.isOfflineData,
      syncedAt: data.isOfflineData ? new Date() : undefined,
    });

    // TODO: Broadcast via Socket.io to shipment room
    // io.to(`shipment:${data.shipmentId}`).emit('gps:update', {
    //   truckId: data.truckId,
    //   latitude: normalizedLat,
    //   longitude: normalizedLng,
    //   heading: data.heading,
    //   speed: data.speed,
    //   timestamp: Date.now(),
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: gpsLog._id,
          truckId: gpsLog.truckId,
          latitude: gpsLog.latitude,
          longitude: gpsLog.longitude,
          timestamp: gpsLog.createdAt,
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('GPS update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
        data: null,
        meta: {},
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gps/update
 * 
 * Get latest GPS update (health check)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', data: null, meta: {} },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { status: 'ready' },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', data: null, meta: {} },
      { status: 401 }
    );
  }
}
