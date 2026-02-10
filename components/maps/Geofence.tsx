'use client';

import React, { useEffect } from 'react';
import { useMapbox, Geofence } from '@/hooks/use-mapbox';

interface GeofenceProps {
  geofence: Geofence;
  onGeofenceAdded?: (geofenceId: string) => void;
}

/**
 * Geofence Component
 * 
 * Renders a geofence polygon on the map
 * Supports polygon-based geofences with visual indicators
 */
export const Geofence: React.FC<GeofenceProps> = ({ geofence, onGeofenceAdded }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const { addGeofence } = useMapbox(mapContainer);

  useEffect(() => {
    if (!geofence.coordinates || geofence.coordinates.length < 3) return;

    // Add geofence to map
    addGeofence(geofence);
    onGeofenceAdded?.(geofence.id);
  }, [geofence, addGeofence, onGeofenceAdded]);

  // This component doesn't render UI itself
  // It manages geofence visualization on the map
  return null;
};

export default Geofence;
