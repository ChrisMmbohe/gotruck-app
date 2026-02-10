import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

const PORT = parseInt(process.env.SOCKET_IO_PORT || '3001', 10);
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const SOCKET_IO_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Authenticates socket connections using Clerk JWT tokens
 * This is a simplified version - in production use full Clerk SDK
 */
async function authenticateSocket(token: string): Promise<{ sub: string; email: string } | null> {
  if (!token || !CLERK_SECRET_KEY) {
    return null;
  }

  try {
    // For now, just validate that token exists
    // In production, use: await verifyToken(token, { secretKey: CLERK_SECRET_KEY })
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null; // Invalid JWT format
    }

    // Basic validation - in production use full verification
    return {
      sub: 'user-id', // Would come from decoded token
      email: 'user@example.com', // Would come from decoded token
    };
  } catch (error) {
    console.error('Socket auth error:', error);
    return null;
  }
}

/**
 * Creates and configures a Socket.io server instance
 */
function createSocketServer(httpServer: http.Server): IOServer {
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

    // Join user's personal room
    const userRoom = `user:${socket.data.userId}`;
    socket.join(userRoom);

    // Heartbeat to prevent disconnections
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Join shipment room
    socket.on('join:shipment', (shipmentId: string) => {
      if (!shipmentId) return;
      const room = `shipment:${shipmentId}`;
      socket.join(room);
      console.log(`✓ ${socket.data.userId} joined shipment room: ${room}`);
      socket.emit('room:joined', { room, shipmentId });
    });

    // Leave shipment room
    socket.on('leave:shipment', (shipmentId: string) => {
      if (!shipmentId) return;
      const room = `shipment:${shipmentId}`;
      socket.leave(room);
      console.log(`✗ ${socket.data.userId} left shipment room: ${room}`);
    });

    // Join fleet room
    socket.on('join:fleet', (fleetId: string) => {
      if (!fleetId) return;
      const room = `fleet:${fleetId}`;
      socket.join(room);
      console.log(`✓ ${socket.data.userId} joined fleet room: ${room}`);
      socket.emit('room:joined', { room, fleetId });
    });

    // Leave fleet room
    socket.on('leave:fleet', (fleetId: string) => {
      if (!fleetId) return;
      const room = `fleet:${fleetId}`;
      socket.leave(room);
      console.log(`✗ ${socket.data.userId} left fleet room: ${room}`);
    });

    // List current rooms
    socket.on('rooms:list', (callback) => {
      const rooms = Array.from(socket.rooms);
      callback(rooms);
    });

    // GPS update event
    socket.on('gps:update', (data: any) => {
      if (data.shipmentId) {
        const room = `shipment:${data.shipmentId}`;
        socket.broadcast.to(room).emit('location:changed', data);
      }
      if (data.fleetId) {
        const room = `fleet:${data.fleetId}`;
        socket.broadcast.to(room).emit('truck:status', data);
      }
    });

    // Batch GPS updates
    socket.on('gps:batch', (data: any) => {
      if (data.shipmentId) {
        const room = `shipment:${data.shipmentId}`;
        io.to(room).emit('gps:batch', data);
      }
    });

    // Geofence events
    socket.on('geofence:entered', (data: any) => {
      if (data.shipmentId) {
        const room = `shipment:${data.shipmentId}`;
        io.to(room).emit('geofence:entered', data);
      }
    });

    socket.on('geofence:exited', (data: any) => {
      if (data.shipmentId) {
        const room = `shipment:${data.shipmentId}`;
        io.to(room).emit('geofence:exited', data);
      }
    });

    // Alert events
    socket.on('alert:triggered', (data: any) => {
      const userRoom = `user:${socket.data.userId}`;
      io.to(userRoom).emit('alert:triggered', data);
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

// Create HTTP server
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.io Server Running\n');
});

// Create Socket.io server
const io = createSocketServer(httpServer);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down Socket.io server...');
  io.close();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Socket.io server running on http://localhost:${PORT}`);
  console.log(`📡 Make sure SOCKET_IO_SERVER_URL=http://localhost:${PORT} in .env.local\n`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
