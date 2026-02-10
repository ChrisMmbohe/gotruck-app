'use client';

import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapbox } from '@/hooks/use-mapbox';
import { MAPBOX_CONFIG, isMapboxAvailable } from '@/lib/maps/mapbox-config';

interface MapContainerProps {
  onMapReady?: (mapInstance: any) => void;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
}

/**
 * MapContainer Component
 * 
 * Renders a Mapbox GL map with support for:
 * - Real-time truck markers
 * - Route visualization
 * - Geofencing
 * - Interactive controls
 */
export const MapContainer: React.FC<MapContainerProps> = ({
  onMapReady,
  className = '',
  style = {},
  showControls = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, mapLoaded } = useMapbox(mapContainer);

  useEffect(() => {
    if (mapLoaded && map && onMapReady) {
      onMapReady(map);
    }
  }, [mapLoaded, map, onMapReady]);

  if (!isMapboxAvailable()) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-center">
          <p className="text-gray-600">⚠️ Mapbox token not configured</p>
          <p className="text-sm text-gray-500">Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`w-full bg-gray-50 rounded-lg overflow-hidden ${className}`}
      style={{
        height: '600px',
        minHeight: '400px',
        ...style,
      }}
    >
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
