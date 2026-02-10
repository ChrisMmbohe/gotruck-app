import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * POST /api/socket/route.ts
 * 
 * Provides socket configuration to client
 * Validates user authentication before allowing socket connection
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

    const SOCKET_IO_SERVER_URL = process.env.SOCKET_IO_SERVER_URL || 'http://localhost:3001';

    return NextResponse.json(
      {
        success: true,
        data: {
          serverUrl: SOCKET_IO_SERVER_URL,
          userId,
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Socket config error:', error);
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
 * GET /api/socket/route.ts
 * 
 * Health check for socket server
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
          status: 'ok',
          socketServerUrl: process.env.SOCKET_IO_SERVER_URL,
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        data: null,
        meta: {},
      },
      { status: 401 }
    );
  }
}
