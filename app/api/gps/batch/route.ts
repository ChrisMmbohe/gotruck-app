import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateGPSBatch, normalizeCoordinates } from '@/lib/gps/validator';
import { batchInsertGPSLogs, markGPSLogsAsSynced } from '@/lib/db/models/GPSLog';
import { connectDB } from '@/lib/db/mongodb';

/**
 * POST /api/gps/batch
 * 
 * Batch insert multiple GPS location updates
 * Used for offline syncing and bulk data collection
 * Handles up to 1000 updates per request
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
    const validation = validateGPSBatch(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error, data: null, meta: {} },
        { status: 400 }
      );
    }

    const batchData = validation.data!;

    // Limit to 1000 updates per batch
    if (batchData.updates.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batch size exceeds 1000 updates',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Normalize and prepare GPS logs
    const logsToInsert = batchData.updates.map((update) => {
      const [normalizedLat, normalizedLng] = normalizeCoordinates(
        update.latitude,
        update.longitude
      );

      return {
        truckId: update.truckId,
        shipmentId: update.shipmentId,
        fleetId: update.fleetId,
        userId,
        latitude: normalizedLat,
        longitude: normalizedLng,
        accuracy: update.accuracy,
        heading: update.heading,
        speed: update.speed,
        altitude: update.altitude,
        batteryLevel: update.batteryLevel,
        isOfflineData: update.isOfflineData,
        syncedAt: update.isOfflineData ? new Date() : undefined,
      };
    });

    // Batch insert
    const insertedLogs = await batchInsertGPSLogs(logsToInsert);

    // Broadcast to Socket.io rooms
    // TODO: For each shipment, emit gps:batch event
    // const shipmentIds = new Set(batchData.updates.map(u => u.shipmentId).filter(Boolean));
    // shipmentIds.forEach(shipmentId => {
    //   io.to(`shipment:${shipmentId}`).emit('gps:batch', {
    //     count: insertedLogs.length,
    //     timestamp: Date.now(),
    //   });
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          insertedCount: insertedLogs.length,
          totalCount: batchData.updates.length,
          failedCount: batchData.updates.length - insertedLogs.length,
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('GPS batch insert error:', error);
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
 * GET /api/gps/batch
 * 
 * Get batch upload status or information
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
        data: {
          status: 'ready',
          maxBatchSize: 1000,
          recommendedBatchSize: 100,
        },
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
