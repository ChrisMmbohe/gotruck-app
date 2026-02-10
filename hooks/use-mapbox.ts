'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import MapboxGL, { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { MAPBOX_CONFIG, ROUTE_SETTINGS, MARKER_STYLES } from '@/lib/maps/mapbox-config';

interface TruckLocation {
  id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface Geofence {
  id: string;
  coordinates: [number, number][];
  name: string;
  radius?: number;
  center?: [number, number];
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

/**
 * Custom hook for Mapbox interactions and state management
 */
export function useMapbox(mapContainer: React.RefObject<HTMLDivElement>) {
  const mapRef = useRef<MapboxGL.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [center, setCenter] = useState<LngLatLike>(MAPBOX_CONFIG.defaultCenter);
  const [zoom, setZoom] = useState(MAPBOX_CONFIG.defaultZoom);
  const trucksRef = useRef<Map<string, TruckLocation>>(new Map());
  const geofencesRef = useRef<Map<string, Geofence>>(new Map());
  const routeLayersRef = useRef<Set<string>>(new Set());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    MapboxGL.accessToken = MAPBOX_CONFIG.accessToken;

    const map = new MapboxGL.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: MAPBOX_CONFIG.defaultCenter,
      zoom: MAPBOX_CONFIG.defaultZoom,
      minZoom: MAPBOX_CONFIG.minZoom,
      maxZoom: MAPBOX_CONFIG.maxZoom,
    });

    map.on('load', () => {
      setMapLoaded(true);
      console.log('✓ Mapbox map loaded');
    });

    map.on('move', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      setCenter(center);
      setZoom(zoom);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Add truck marker
  const addTruckMarker = useCallback(
    (truck: TruckLocation) => {
      if (!mapRef.current?.isStyleLoaded()) return;

      const { id, latitude, longitude, heading = 0 } = truck;
      trucksRef.current.set(id, truck);

      // Remove existing marker if present
      const existingMarker = document.getElementById(`truck-${id}`);
      if (existingMarker) existingMarker.remove();

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.id = `truck-${id}`;
      markerEl.style.width = `${MARKER_STYLES.truck.width}px`;
      markerEl.style.height = `${MARKER_STYLES.truck.height}px`;
      markerEl.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(MARKER_STYLES.truck.color)}'%3E%3Cpath d='M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'/%3E%3Cpath d='M20 8H4V4h16v4zm0 2v6h-2v-6h2zM2 10v6h2v-6H2z'/%3E%3C/svg%3E")`;
      markerEl.style.backgroundSize = 'contain';
      markerEl.style.backgroundRepeat = 'no-repeat';
      markerEl.style.backgroundPosition = 'center';
      markerEl.style.transform = `rotate(${heading}deg)`;
      markerEl.style.cursor = 'pointer';

      // Add popup
      const popup = new MapboxGL.Popup({ offset: 25 }).setHTML(
        `<div class="p-2"><strong>${id}</strong><br/>Speed: ${truck.speed || 0} km/h</div>`
      );

      new MapboxGL.Marker(markerEl)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(mapRef.current);
    },
    []
  );

  // Update truck position with animation
  const updateTruckMarker = useCallback(
    (truck: TruckLocation) => {
      const marker = document.getElementById(`truck-${truck.id}`);
      if (!marker) {
        addTruckMarker(truck);
        return;
      }

      // Animate marker rotation and position
      if (truck.heading !== undefined) {
        marker.style.transform = `rotate(${truck.heading}deg)`;
      }

      // Update marker position
      const markerElement = marker.parentElement;
      if (markerElement) {
        markerElement.style.transition = 'transform 1s ease-in-out';
      }

      trucksRef.current.set(truck.id, truck);
    },
    [addTruckMarker]
  );

  // Draw route polyline
  const drawRoute = useCallback(
    (routePoints: RoutePoint[], shipmentId: string) => {
      if (!mapRef.current?.isStyleLoaded()) return;

      const layerId = `route-${shipmentId}`;
      const sourceId = `route-source-${shipmentId}`;

      // Add source
      if (!mapRef.current.getSource(sourceId)) {
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: routePoints.map((p) => [p.longitude, p.latitude]),
                },
                properties: {},
              },
            ],
          },
        });
      }

      // Add layer
      if (!mapRef.current.getLayer(layerId)) {
        mapRef.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': ROUTE_SETTINGS.color,
            'line-width': ROUTE_SETTINGS.width,
            'line-opacity': ROUTE_SETTINGS.opacity,
          },
        });
        routeLayersRef.current.add(layerId);
      }
    },
    []
  );

  // Add geofence polygon
  const addGeofence = useCallback(
    (geofence: Geofence) => {
      if (!mapRef.current?.isStyleLoaded()) return;

      geofencesRef.current.set(geofence.id, geofence);

      const sourceId = `geofence-${geofence.id}`;
      const layerId = `geofence-layer-${geofence.id}`;

      // Add source
      if (!mapRef.current.getSource(sourceId)) {
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [geofence.coordinates],
                },
                properties: { name: geofence.name },
              },
            ],
          },
        });
      }

      // Add fill layer
      if (!mapRef.current.getLayer(layerId)) {
        mapRef.current.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#f59e0b',
            'fill-opacity': 0.2,
          },
        });

        // Add border layer
        mapRef.current.addLayer({
          id: `${layerId}-outline`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#f59e0b',
            'line-width': 2,
            'line-opacity': 0.8,
          },
        });
      }
    },
    []
  );

  // Fit map to bounds
  const fitBounds = useCallback(
    (bounds: [[number, number], [number, number]], padding = 50) => {
      if (!mapRef.current) return;
      mapRef.current.fitBounds(bounds, { padding });
    },
    []
  );

  // Fit map to all trucks
  const fitToTrucks = useCallback(() => {
    if (!mapRef.current || trucksRef.current.size === 0) return;

    const trucks = Array.from(trucksRef.current.values());
    let minLng = trucks[0].longitude;
    let maxLng = trucks[0].longitude;
    let minLat = trucks[0].latitude;
    let maxLat = trucks[0].latitude;

    trucks.forEach((truck) => {
      minLng = Math.min(minLng, truck.longitude);
      maxLng = Math.max(maxLng, truck.longitude);
      minLat = Math.min(minLat, truck.latitude);
      maxLat = Math.max(maxLat, truck.latitude);
    });

    fitBounds([
      [minLng, minLat],
      [maxLng, maxLat],
    ]);
  }, [fitBounds]);

  // Remove truck marker
  const removeTruckMarker = useCallback((truckId: string) => {
    const marker = document.getElementById(`truck-${truckId}`);
    if (marker) marker.parentElement?.remove();
    trucksRef.current.delete(truckId);
  }, []);

  // Remove geofence
  const removeGeofence = useCallback((geofenceId: string) => {
    if (!mapRef.current) return;

    const layerId = `geofence-layer-${geofenceId}`;
    const sourceId = `geofence-${geofenceId}`;

    if (mapRef.current.getLayer(layerId)) {
      mapRef.current.removeLayer(layerId);
      mapRef.current.removeLayer(`${layerId}-outline`);
    }
    if (mapRef.current.getSource(sourceId)) {
      mapRef.current.removeSource(sourceId);
    }

    geofencesRef.current.delete(geofenceId);
  }, []);

  // Fly to location
  const flyTo = useCallback(
    (lng: number, lat: number, zoom = 15) => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom,
        duration: 1000,
      });
    },
    []
  );

  // Toggle 3D terrain
  const toggle3DTerrain = useCallback(() => {
    if (!mapRef.current?.isStyleLoaded()) return;

    // This requires the terrain layer to be available in the style
    // For now, just log the toggle action
    console.log('3D Terrain toggle requested');
  }, []);

  return {
    map: mapRef.current,
    mapLoaded,
    center,
    zoom,
    addTruckMarker,
    updateTruckMarker,
    removeTruckMarker,
    drawRoute,
    addGeofence,
    removeGeofence,
    fitBounds,
    fitToTrucks,
    flyTo,
    toggle3DTerrain,
  };
}

export type { TruckLocation, Geofence, RoutePoint };
