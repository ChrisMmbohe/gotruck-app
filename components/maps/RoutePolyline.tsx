'use client';

import React, { useEffect } from 'react';
import { useMapbox, RoutePoint } from '@/hooks/use-mapbox';

interface RoutePolylineProps {
  shipmentId: string;
  routePoints: RoutePoint[];
  isCompleted?: boolean;
  onRouteDrawn?: () => void;
}

/**
 * RoutePolyline Component
 * 
 * Renders a polyline on the map showing the planned or actual route
 * Supports both completed and active routes with different styling
 */
export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  shipmentId,
  routePoints,
  isCompleted = false,
  onRouteDrawn,
}) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const { drawRoute } = useMapbox(mapContainer);

  useEffect(() => {
    if (routePoints.length < 2) return;

    // Draw the route on the map
    drawRoute(routePoints, shipmentId);

    onRouteDrawn?.();
  }, [routePoints, shipmentId, drawRoute, onRouteDrawn]);

  // This component doesn't render UI itself
  // It only manages route polylines on the map via the useMapbox hook
  return null;
};

export default RoutePolyline;
