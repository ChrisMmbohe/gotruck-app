/**
 * Mapbox configuration and constants
 */

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  style: 'mapbox://styles/mapbox/streets-v12',
  defaultZoom: 13,
  minZoom: 3,
  maxZoom: 20,
  defaultCenter: {
    lng: -122.4194, // San Francisco default
    lat: 37.7749,
  },
};

/**
 * Map style themes
 */
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
};

/**
 * Marker sizes and styling
 */
export const MARKER_STYLES = {
  truck: {
    width: 40,
    height: 40,
    color: '#2563eb',
    offset: [0, -20],
  },
  pickup: {
    width: 32,
    height: 32,
    color: '#16a34a',
    offset: [0, -16],
  },
  delivery: {
    width: 32,
    height: 32,
    color: '#dc2626',
    offset: [0, -16],
  },
  geofence: {
    width: 12,
    height: 12,
    color: '#f59e0b',
    offset: [0, -6],
  },
};

/**
 * Route visualization settings
 */
export const ROUTE_SETTINGS = {
  color: '#3b82f6',
  width: 3,
  opacity: 0.7,
  completedColor: '#10b981',
  completedOpacity: 0.5,
};

/**
 * Clustering settings for multiple trucks
 */
export const CLUSTERING_SETTINGS = {
  radius: 50, // Cluster radius in pixels
  maxZoom: 14, // Maximum zoom level to cluster
  clusterColors: {
    small: '#3b82f6', // Blue: 0-5 trucks
    medium: '#f59e0b', // Amber: 5-20 trucks
    large: '#dc2626', // Red: 20+ trucks
  },
};

/**
 * Animation settings
 */
export const ANIMATION_SETTINGS = {
  vehicleMovementDuration: 1000, // ms
  smoothing: true,
  pathSmoothing: true,
};

/**
 * Geofence settings
 */
export const GEOFENCE_SETTINGS = {
  defaultColor: '#f59e0b',
  defaultOpacity: 0.2,
  borderOpacity: 0.8,
  borderWidth: 2,
  enterColor: '#10b981',
  exitColor: '#dc2626',
};

/**
 * Default map bounds (world)
 */
export const DEFAULT_BOUNDS = {
  min: [-180, -85] as [number, number],
  max: [180, 85] as [number, number],
};

/**
 * Utils for Mapbox configuration
 */
export function getMapboxToken(): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    console.warn('NEXT_PUBLIC_MAPBOX_TOKEN is not set');
  }
  return token || '';
}

export function isMapboxAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}
