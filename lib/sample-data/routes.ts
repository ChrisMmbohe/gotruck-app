/**
 * EAC Route Definitions
 * Contains coordinates for major freight corridors across East African Community
 */

export interface RouteWaypoint {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface FreightCorridor {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number; // km
  estimatedDuration: number; // hours
  waypoints: RouteWaypoint[];
}

export const MAJOR_CITIES: Record<string, RouteWaypoint> = {
  nairobi: {
    city: 'Nairobi',
    country: 'Kenya',
    latitude: -1.2921,
    longitude: 36.8219,
    description: 'Capital of Kenya, major logistics hub',
  },
  mombasa: {
    city: 'Mombasa',
    country: 'Kenya',
    latitude: -4.0435,
    longitude: 39.6682,
    description: 'Kenyan port city',
  },
  kampala: {
    city: 'Kampala',
    country: 'Uganda',
    latitude: 0.3476,
    longitude: 32.5825,
    description: 'Capital of Uganda',
  },
  kigali: {
    city: 'Kigali',
    country: 'Rwanda',
    latitude: -1.9536,
    longitude: 30.0606,
    description: 'Capital of Rwanda',
  },
  dar: {
    city: 'Dar es Salaam',
    country: 'Tanzania',
    latitude: -6.7924,
    longitude: 39.2083,
    description: 'Tanzanian port city',
  },
  dodoma: {
    city: 'Dodoma',
    country: 'Tanzania',
    latitude: -6.1719,
    longitude: 35.7395,
    description: 'Capital of Tanzania',
  },
  moshi: {
    city: 'Moshi',
    country: 'Tanzania',
    latitude: -3.3667,
    longitude: 37.66,
    description: 'Northern Tanzania, near Mount Kilimanjaro',
  },
  arusha: {
    city: 'Arusha',
    country: 'Tanzania',
    latitude: -3.3667,
    longitude: 36.6833,
    description: 'Gateway to Mount Kilimanjaro',
  },
  bujumbura: {
    city: 'Bujumbura',
    country: 'Burundi',
    latitude: -3.3731,
    longitude: 29.3585,
    description: 'Capital of Burundi on Lake Tanganyika',
  },
  juba: {
    city: 'Juba',
    country: 'South Sudan',
    latitude: 4.8517,
    longitude: 31.5825,
    description: 'New capital of South Sudan',
  },
};

/**
 * Major freight corridors across EAC
 * These are actual trade routes used for freight transportation
 */
export const FREIGHT_CORRIDORS: FreightCorridor[] = [
  {
    id: 'nairobi-kampala',
    name: 'Nairobi-Kampala Corridor',
    origin: 'Nairobi',
    destination: 'Kampala',
    distance: 800,
    estimatedDuration: 16,
    waypoints: [
      MAJOR_CITIES.nairobi,
      {
        city: 'Nakuru',
        country: 'Kenya',
        latitude: -0.2833,
        longitude: 36.0667,
        description: 'Stop point',
      },
      {
        city: 'Eldoret',
        country: 'Kenya',
        latitude: 0.5143,
        longitude: 34.7617,
        description: 'Stop point',
      },
      {
        city: 'Kisumu',
        country: 'Kenya',
        latitude: -0.1022,
        longitude: 34.7617,
        description: 'Lake port town',
      },
      {
        city: 'Jinja',
        country: 'Uganda',
        latitude: 0.4369,
        longitude: 33.2317,
        description: 'Border crossing area',
      },
      MAJOR_CITIES.kampala,
    ],
  },
  {
    id: 'mombasa-dar',
    name: 'Mombasa-Dar es Salaam Corridor',
    origin: 'Mombasa',
    destination: 'Dar es Salaam',
    distance: 650,
    estimatedDuration: 13,
    waypoints: [
      MAJOR_CITIES.mombasa,
      {
        city: 'Malindi',
        country: 'Kenya',
        latitude: -3.2167,
        longitude: 40.1167,
        description: 'Coastal town',
      },
      {
        city: 'Lamu',
        country: 'Kenya',
        latitude: -2.2667,
        longitude: 40.8997,
        description: 'Island port',
      },
      {
        city: 'Tanga',
        country: 'Tanzania',
        latitude: -5.0667,
        longitude: 39.1667,
        description: 'Northern Tanzania port',
      },
      MAJOR_CITIES.dar,
    ],
  },
  {
    id: 'nairobi-dar',
    name: 'Nairobi-Dar es Salaam Corridor',
    origin: 'Nairobi',
    destination: 'Dar es Salaam',
    distance: 950,
    estimatedDuration: 19,
    waypoints: [
      MAJOR_CITIES.nairobi,
      {
        city: 'Machakos',
        country: 'Kenya',
        latitude: -2.3031,
        longitude: 37.2644,
        description: 'Stop point',
      },
      {
        city: 'Voi',
        country: 'Kenya',
        latitude: -3.3969,
        longitude: 38.5727,
        description: 'Stop point',
      },
      {
        city: 'Moshi',
        country: 'Tanzania',
        latitude: -3.3667,
        longitude: 37.66,
        description: 'Stop point',
      },
      {
        city: 'Iringa',
        country: 'Tanzania',
        latitude: -7.77,
        longitude: 35.79,
        description: 'Stop point',
      },
      MAJOR_CITIES.dar,
    ],
  },
  {
    id: 'kampala-kigali',
    name: 'Kampala-Kigali Corridor',
    origin: 'Kampala',
    destination: 'Kigali',
    distance: 410,
    estimatedDuration: 8,
    waypoints: [
      MAJOR_CITIES.kampala,
      {
        city: 'Masaka',
        country: 'Uganda',
        latitude: -0.3333,
        longitude: 31.75,
        description: 'Western Uganda',
      },
      {
        city: 'Kabale',
        country: 'Uganda',
        latitude: -1.2522,
        longitude: 29.9317,
        description: 'Border town',
      },
      {
        city: 'Musanze',
        country: 'Rwanda',
        latitude: -1.5,
        longitude: 29.6,
        description: 'Northern Rwanda',
      },
      MAJOR_CITIES.kigali,
    ],
  },
  {
    id: 'nairobi-arusha',
    name: 'Nairobi-Arusha Corridor',
    origin: 'Nairobi',
    destination: 'Arusha',
    distance: 400,
    estimatedDuration: 8,
    waypoints: [
      MAJOR_CITIES.nairobi,
      {
        city: 'Athi River',
        country: 'Kenya',
        latitude: -2.6639,
        longitude: 36.9931,
        description: 'Industrial area',
      },
      {
        city: 'Kajiado',
        country: 'Kenya',
        latitude: -2.8473,
        longitude: 36.7781,
        description: 'Stop point',
      },
      {
        city: 'Namanga',
        country: 'Kenya',
        latitude: -2.8149,
        longitude: 36.7808,
        description: 'Border town',
      },
      {
        city: 'Arusha',
        country: 'Tanzania',
        latitude: -3.3667,
        longitude: 36.6833,
        description: 'Gateway to Kilimanjaro',
      },
    ],
  },
  {
    id: 'dar-dodoma',
    name: 'Dar-Dodoma Corridor',
    origin: 'Dar es Salaam',
    destination: 'Dodoma',
    distance: 450,
    estimatedDuration: 9,
    waypoints: [
      MAJOR_CITIES.dar,
      {
        city: 'Morogoro',
        country: 'Tanzania',
        latitude: -6.8062,
        longitude: 37.6652,
        description: 'Stop point',
      },
      {
        city: 'Iringa',
        country: 'Tanzania',
        latitude: -7.77,
        longitude: 35.79,
        description: 'Stop point',
      },
      MAJOR_CITIES.dodoma,
    ],
  },
  {
    id: 'kampala-dar',
    name: 'Kampala-Dar es Salaam Corridor',
    origin: 'Kampala',
    destination: 'Dar es Salaam',
    distance: 1200,
    estimatedDuration: 24,
    waypoints: [
      MAJOR_CITIES.kampala,
      {
        city: 'Jinja',
        country: 'Uganda',
        latitude: 0.4369,
        longitude: 33.2317,
        description: 'Stop point',
      },
      {
        city: 'Soroti',
        country: 'Uganda',
        latitude: 1.7118,
        longitude: 33.5873,
        description: 'Regional hub',
      },
      {
        city: 'Mbale',
        country: 'Uganda',
        latitude: 1.0435,
        longitude: 34.1767,
        description: 'Eastern Uganda',
      },
      {
        city: 'Kigoma',
        country: 'Tanzania',
        latitude: -4.8817,
        longitude: 29.6267,
        description: 'Lake port',
      },
      {
        city: 'Tabora',
        country: 'Tanzania',
        latitude: -5.0269,
        longitude: 32.8344,
        description: 'Central hub',
      },
      MAJOR_CITIES.dar,
    ],
  },
];

/**
 * Get a corridor by ID
 */
export function getCorridorById(id: string): FreightCorridor | undefined {
  return FREIGHT_CORRIDORS.find((c) => c.id === id);
}

/**
 * Get all corridors that pass through a city
 */
export function getCorridorsByCity(city: string): FreightCorridor[] {
  return FREIGHT_CORRIDORS.filter((c) =>
    c.waypoints.some((wp) => wp.city.toLowerCase().includes(city.toLowerCase()))
  );
}
