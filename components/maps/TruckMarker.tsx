'use client';

import React, { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';

interface TruckMarkerProps {
  truckId: string;
  shipmentId?: string;
  initialLat?: number;
  initialLng?: number;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

/**
 * TruckMarker Component
 * 
 * Handles real-time truck position updates via Socket.io
 * Updates truck marker on the map with location changes
 */
export const TruckMarker: React.FC<TruckMarkerProps> = ({
  truckId,
  shipmentId,
  initialLat = 0,
  initialLng = 0,
  onLocationUpdate,
}) => {
  const { isConnected, onLocationChanged } = useSocket({ autoConnect: true });

  useEffect(() => {
    if (!isConnected || !onLocationChanged) return;

    // Subscribe to location changes
    const unsubscribe = onLocationChanged((data) => {
      // Only process updates for this truck
      if (data.truckId !== truckId) return;

      onLocationUpdate?.(data.latitude, data.longitude);
    });

    return () => unsubscribe?.();
  }, [isConnected, truckId, onLocationChanged, onLocationUpdate]);

  // This component doesn't render UI itself, it just manages Socket.io listeners
  // The actual marker is rendered by the useMapbox hook
  return null;
};

export default TruckMarker;
