import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { validateGeofenceCoordinates, Geofence } from '@/lib/geofencing/detector';

/**
 * Geofence validation schema
 */
const GeofenceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['polygon', 'circle']),
  coordinates: z.array(z.any()).optional(),
  radius: z.number().min(1).optional(),
  center: z.tuple([z.number(), z.number()]).optional(),
  properties: z.record(z.any()).optional(),
});

type GeofenceInput = z.infer<typeof GeofenceSchema>;

// In-memory geofence storage (replace with DB in production)
const geofencesDB = new Map<string, Geofence>();

/**
 * GET /api/geofences
 * 
 * Retrieve all geofences or filter by fleet/region
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

    const { searchParams } = new URL(request.url);
    const fleetId = searchParams.get('fleetId');
    const region = searchParams.get('region');

    const geofences = Array.from(geofencesDB.values()).filter((g) => {
      if (fleetId && !g.properties?.fleetId?.includes(fleetId)) {
        return false;
      }
      if (region && g.properties?.region !== region) {
        return false;
      }
      return true;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          geofences,
          count: geofences.length,
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get geofences error:', error);
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
 * POST /api/geofences
 * 
 * Create a new geofence
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
    const validation = GeofenceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.message,
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    const data = validation.data as GeofenceInput;
    const id = data.id || `geofence_${Date.now()}`;

    const geofence: Geofence = {
      id,
      name: data.name,
      type: data.type,
      coordinates: data.coordinates || [],
      radius: data.radius,
      center: data.center,
      properties: data.properties,
    };

    // Validate coordinates
    if (!validateGeofenceCoordinates(geofence)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid geofence coordinates',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    // Store geofence
    geofencesDB.set(id, geofence);

    // TODO: Broadcast geofence creation to relevant rooms
    // io.to(`fleet:${geofence.properties?.fleetId}`).emit('geofence:created', geofence);

    return NextResponse.json(
      {
        success: true,
        data: geofence,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create geofence error:', error);
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
 * PUT /api/geofences/[id]
 * 
 * Update an existing geofence
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', data: null, meta: {} },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geofence ID is required',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    const existing = geofencesDB.get(id);
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geofence not found',
          data: null,
          meta: {},
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = GeofenceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.message,
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    const data = validation.data as GeofenceInput;
    const updated: Geofence = {
      ...existing,
      name: data.name,
      type: data.type,
      coordinates: data.coordinates || existing.coordinates,
      radius: data.radius,
      center: data.center,
      properties: data.properties,
    };

    // Validate coordinates
    if (!validateGeofenceCoordinates(updated)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid geofence coordinates',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    geofencesDB.set(id, updated);

    // TODO: Broadcast geofence update
    // io.emit('geofence:updated', updated);

    return NextResponse.json(
      {
        success: true,
        data: updated,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update geofence error:', error);
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
 * DELETE /api/geofences/[id]
 * 
 * Delete a geofence
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', data: null, meta: {} },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geofence ID is required',
          data: null,
          meta: {},
        },
        { status: 400 }
      );
    }

    if (!geofencesDB.has(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geofence not found',
          data: null,
          meta: {},
        },
        { status: 404 }
      );
    }

    geofencesDB.delete(id);

    // TODO: Broadcast geofence deletion
    // io.emit('geofence:deleted', { id });

    return NextResponse.json(
      {
        success: true,
        data: { deletedId: id },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete geofence error:', error);
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
