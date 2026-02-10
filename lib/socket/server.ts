import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { verifyToken } from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const SOCKET_IO_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Authenticates socket connections using Clerk JWT tokens
 */
export async function authenticateSocket(token: string): Promise<{ sub: string; email: string } | null> {
  if (!token || !CLERK_SECRET_KEY) {
    return null;
  }

  try {
    const decoded = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    });
    if (!decoded) return null;
    return {
      sub: decoded.sub,
      email: decoded.email || '',
    };
  } catch (error) {
    console.error('Socket auth error:', error);
    return null;
  }
}

/**
 * Creates and configures a Socket.io server instance
 */
export function createSocketServer(httpServer: HTTPServer): IOServer {
  const io = new IOServer(httpServer, {
    cors: {
      origin: SOCKET_IO_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e7, // 10MB for batch GPS data
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const user = await authenticateSocket(token);

    if (!user) {
      return next(new Error('Unauthorized'));
    }

    socket.data.userId = user.sub;
    socket.data.email = user.email;
    next();
  });

  // Connection event
  io.on('connection', (socket: Socket) => {
    console.log(`✓ User connected: ${socket.data.userId} (${socket.id})`);

    // Heartbeat to prevent disconnections
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`✗ User disconnected: ${socket.data.userId} (${socket.id})`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.data.userId}:`, error);
    });
  });

  return io;
}

export type { Socket, IOServer };
