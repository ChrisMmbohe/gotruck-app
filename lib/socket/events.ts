import { Socket, IOServer } from './server';

/**
 * Event names for Socket.io
 */
export const SOCKET_EVENTS = {
  // GPS Tracking
  GPS_UPDATE: 'gps:update',
  GPS_BATCH: 'gps:batch',
  LOCATION_CHANGED: 'location:changed',

  // Shipments
  SHIPMENT_CREATED: 'shipment:created',
  SHIPMENT_UPDATED: 'shipment:updated',
  SHIPMENT_COMPLETED: 'shipment:completed',

  // Fleet/Trucks
  TRUCK_STATUS: 'truck:status',
  TRUCK_OFFLINE: 'truck:offline',
  TRUCK_ONLINE: 'truck:online',

  // Geofencing
  GEOFENCE_ENTERED: 'geofence:entered',
  GEOFENCE_EXITED: 'geofence:exited',
  GEOFENCE_ALERT: 'geofence:alert',

  // Alerts
  ALERT_TRIGGERED: 'alert:triggered',
  ALERT_DISMISSED: 'alert:dismissed',

  // Errors
  SYNC_ERROR: 'sync:error',
};

/**
 * Room naming conventions for organizing socket connections
 */
export const ROOM_PATTERNS = {
  shipment: (shipmentId: string) => `shipment:${shipmentId}`,
  fleet: (fleetId: string) => `fleet:${fleetId}`,
  truck: (truckId: string) => `truck:${truckId}`,
  user: (userId: string) => `user:${userId}`,
  broadcast: 'broadcast:fleet',
};

/**
 * Registers event handlers and room management on socket connection
 */
export function registerSocketEvents(io: IOServer, socket: Socket): void {
  const userId = socket.data.userId;

  // Join user's personal room for targeted updates
  const userRoom = ROOM_PATTERNS.user(userId);
  socket.join(userRoom);
  console.log(`✓ User ${userId} joined room: ${userRoom}`);

  /**
   * Join a shipment room for real-time tracking
   */
  socket.on('join:shipment', (shipmentId: string) => {
    if (!shipmentId) return;
    const room = ROOM_PATTERNS.shipment(shipmentId);
    socket.join(room);
    console.log(`✓ ${userId} joined shipment room: ${room}`);
    socket.emit('room:joined', { room, shipmentId });
  });

  /**
   * Leave a shipment room
   */
  socket.on('leave:shipment', (shipmentId: string) => {
    if (!shipmentId) return;
    const room = ROOM_PATTERNS.shipment(shipmentId);
    socket.leave(room);
    console.log(`✗ ${userId} left shipment room: ${room}`);
  });

  /**
   * Join a fleet room for broadcast updates
   */
  socket.on('join:fleet', (fleetId: string) => {
    if (!fleetId) return;
    const room = ROOM_PATTERNS.fleet(fleetId);
    socket.join(room);
    console.log(`✓ ${userId} joined fleet room: ${room}`);
    socket.emit('room:joined', { room, fleetId });
  });

  /**
   * Leave a fleet room
   */
  socket.on('leave:fleet', (fleetId: string) => {
    if (!fleetId) return;
    const room = ROOM_PATTERNS.fleet(fleetId);
    socket.leave(room);
    console.log(`✗ ${userId} left fleet room: ${room}`);
  });

  /**
   * Get current rooms the user is in
   */
  socket.on('rooms:list', (callback) => {
    const rooms = Array.from(socket.rooms);
    callback(rooms);
  });

  /**
   * Handle GPS update event
   */
  socket.on(SOCKET_EVENTS.GPS_UPDATE, (data: any) => {
    // Broadcast to shipment room
    if (data.shipmentId) {
      const room = ROOM_PATTERNS.shipment(data.shipmentId);
      socket.broadcast.to(room).emit(SOCKET_EVENTS.LOCATION_CHANGED, data);
    }
    // Broadcast to fleet room
    if (data.fleetId) {
      const room = ROOM_PATTERNS.fleet(data.fleetId);
      socket.broadcast.to(room).emit(SOCKET_EVENTS.TRUCK_STATUS, data);
    }
  });

  /**
   * Handle batch GPS updates
   */
  socket.on(SOCKET_EVENTS.GPS_BATCH, (data: any) => {
    if (data.shipmentId) {
      const room = ROOM_PATTERNS.shipment(data.shipmentId);
      io.to(room).emit(SOCKET_EVENTS.GPS_BATCH, data);
    }
  });

  /**
   * Handle geofence events
   */
  socket.on(SOCKET_EVENTS.GEOFENCE_ENTERED, (data: any) => {
    if (data.shipmentId) {
      const room = ROOM_PATTERNS.shipment(data.shipmentId);
      io.to(room).emit(SOCKET_EVENTS.GEOFENCE_ENTERED, data);
    }
  });

  socket.on(SOCKET_EVENTS.GEOFENCE_EXITED, (data: any) => {
    if (data.shipmentId) {
      const room = ROOM_PATTERNS.shipment(data.shipmentId);
      io.to(room).emit(SOCKET_EVENTS.GEOFENCE_EXITED, data);
    }
  });

  /**
   * Handle alert events
   */
  socket.on(SOCKET_EVENTS.ALERT_TRIGGERED, (data: any) => {
    const userRoom = ROOM_PATTERNS.user(userId);
    io.to(userRoom).emit(SOCKET_EVENTS.ALERT_TRIGGERED, data);
  });

  /**
   * Clean up rooms on disconnect
   */
  socket.on('disconnect', () => {
    console.log(`✗ Cleaning up rooms for user: ${userId}`);
  });
}
