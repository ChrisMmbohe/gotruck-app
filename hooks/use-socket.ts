'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import io, { Socket } from 'socket.io-client';
import { SOCKET_EVENTS, ROOM_PATTERNS } from '@/lib/socket/events';

const SOCKET_IO_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL || 'http://localhost:3001';

interface UseSocketOptions {
  autoConnect?: boolean;
  debug?: boolean;
}

interface SocketData {
  shipmentId?: string;
  truckId?: string;
  fleetId?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

/**
 * Custom hook for Socket.io client connection and event management
 */
export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, debug = false } = options;
  const { getToken, userId } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectAttemptRef = useRef(0);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect || !userId) return;

    const connectSocket = async () => {
      try {
        setIsConnecting(true);
        const token = await getToken({ template: 'integration_socketio' });

        if (!token) {
          console.error('Failed to get Clerk token for socket');
          return;
        }

        const socket = io(SOCKET_IO_SERVER_URL, {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
          setIsConnected(true);
          setIsConnecting(false);
          reconnectAttemptRef.current = 0;
          if (debug) console.log('✓ Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
          if (debug) console.log('✗ Socket disconnected');
        });

        socket.on('connect_error', (error) => {
          setIsConnecting(false);
          reconnectAttemptRef.current += 1;
          console.error('Socket connection error:', error);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setIsConnecting(false);
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, getToken, autoConnect, debug]);

  // Join a shipment room
  const joinShipment = useCallback(
    (shipmentId: string) => {
      if (!socketRef.current?.connected) return;
      socketRef.current.emit('join:shipment', shipmentId);
    },
    []
  );

  // Leave a shipment room
  const leaveShipment = useCallback((shipmentId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('leave:shipment', shipmentId);
  }, []);

  // Join a fleet room
  const joinFleet = useCallback((fleetId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('join:fleet', fleetId);
  }, []);

  // Leave a fleet room
  const leaveFleet = useCallback((fleetId: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('leave:fleet', fleetId);
  }, []);

  // Send GPS update
  const sendGPSUpdate = useCallback((data: SocketData) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit(SOCKET_EVENTS.GPS_UPDATE, {
      ...data,
      userId,
      timestamp: Date.now(),
    });
  }, [userId]);

  // Send batch GPS updates
  const sendGPSBatch = useCallback((updates: SocketData[]) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit(SOCKET_EVENTS.GPS_BATCH, {
      userId,
      updates,
      timestamp: Date.now(),
    });
  }, [userId]);

  // Listen to location changes
  const onLocationChanged = useCallback(
    (callback: (data: SocketData) => void) => {
      if (!socketRef.current) return;
      socketRef.current.on(SOCKET_EVENTS.LOCATION_CHANGED, callback);
      return () => {
        socketRef.current?.off(SOCKET_EVENTS.LOCATION_CHANGED, callback);
      };
    },
    []
  );

  // Listen to truck status
  const onTruckStatus = useCallback((callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(SOCKET_EVENTS.TRUCK_STATUS, callback);
    return () => {
      socketRef.current?.off(SOCKET_EVENTS.TRUCK_STATUS, callback);
    };
  }, []);

  // Listen to geofence events
  const onGeofenceEntered = useCallback((callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(SOCKET_EVENTS.GEOFENCE_ENTERED, callback);
    return () => {
      socketRef.current?.off(SOCKET_EVENTS.GEOFENCE_ENTERED, callback);
    };
  }, []);

  const onGeofenceExited = useCallback((callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(SOCKET_EVENTS.GEOFENCE_EXITED, callback);
    return () => {
      socketRef.current?.off(SOCKET_EVENTS.GEOFENCE_EXITED, callback);
    };
  }, []);

  // Listen to alerts
  const onAlertTriggered = useCallback((callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(SOCKET_EVENTS.ALERT_TRIGGERED, callback);
    return () => {
      socketRef.current?.off(SOCKET_EVENTS.ALERT_TRIGGERED, callback);
    };
  }, []);

  // Generic event listener
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, callback);
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  // Generic event emitter
  const emit = useCallback((event: string, data: any) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit(event, data);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    joinShipment,
    leaveShipment,
    joinFleet,
    leaveFleet,
    sendGPSUpdate,
    sendGPSBatch,
    onLocationChanged,
    onTruckStatus,
    onGeofenceEntered,
    onGeofenceExited,
    onAlertTriggered,
    on,
    emit,
  };
}

export type { SocketData };
