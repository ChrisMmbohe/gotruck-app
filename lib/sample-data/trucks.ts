/**
 * Sample Truck Fleet Data
 * Realistic truck data for EAC freight logistics
 */

export type TruckStatus = 'available' | 'in_transit' | 'maintenance' | 'inactive';
export type VehicleType = 'truck' | 'van' | 'pickup' | 'trailer';

export interface SampleTruck {
  id: string;
  plateNumber: string;
  model: string;
  manufacturer: string;
  year: number;
  capacityKg: number;
  fuelType: 'diesel' | 'petrol' | 'gas';
  vehicleType: VehicleType;
  assignedDriver?: {
    name: string;
    licenseNumber: string;
  };
  status: TruckStatus;
  lastLatitude: number;
  lastLongitude: number;
  lastUpdated: Date;
  currentRoute?: string;
  destination?: string;
}

export const SAMPLE_TRUCKS: SampleTruck[] = [
  {
    id: 'truck-001',
    plateNumber: 'KBZ-421',
    model: 'Actros',
    manufacturer: 'Mercedes-Benz',
    year: 2022,
    capacityKg: 25000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Samuel Kamau',
      licenseNumber: 'DL-KE-2019-0001',
    },
    status: 'in_transit',
    lastLatitude: -1.2921,
    lastLongitude: 36.8219,
    lastUpdated: new Date(),
    currentRoute: 'nairobi-kampala',
    destination: 'Kampala',
  },
  {
    id: 'truck-002',
    plateNumber: 'UAZ-102',
    model: 'Hino 700',
    manufacturer: 'Hino',
    year: 2021,
    capacityKg: 20000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'John Ochieng',
      licenseNumber: 'DL-KE-2018-0045',
    },
    status: 'idle',
    lastLatitude: 0.3476,
    lastLongitude: 32.5825,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    currentRoute: 'kampala-kigali',
    destination: 'Kigali',
  },
  {
    id: 'truck-003',
    plateNumber: 'TZA-305',
    model: 'Volvo FH',
    manufacturer: 'Volvo',
    year: 2023,
    capacityKg: 30000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Grace Mwangi',
      licenseNumber: 'DL-KE-2020-0012',
    },
    status: 'in_transit',
    lastLatitude: -6.7924,
    lastLongitude: 39.2083,
    lastUpdated: new Date(),
    currentRoute: 'mombasa-dar',
    destination: 'Dar es Salaam',
  },
  {
    id: 'truck-004',
    plateNumber: 'KEN-847',
    model: 'Scania R450',
    manufacturer: 'Scania',
    year: 2022,
    capacityKg: 28000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'David Kipchoge',
      licenseNumber: 'DL-KE-2017-0078',
    },
    status: 'in_transit',
    lastLatitude: -4.0435,
    lastLongitude: 39.6682,
    lastUpdated: new Date(),
    currentRoute: 'mombasa-dar',
    destination: 'Mombasa',
  },
  {
    id: 'truck-005',
    plateNumber: 'UGA-234',
    model: 'Isuzu NPR',
    manufacturer: 'Isuzu',
    year: 2021,
    capacityKg: 15000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Peter Nabwire',
      licenseNumber: 'DL-UG-2019-0034',
    },
    status: 'idle',
    lastLatitude: 0.3476,
    lastLongitude: 32.5825,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
    destination: 'Available',
  },
  {
    id: 'truck-006',
    plateNumber: 'RWA-112',
    model: 'FAW J6K',
    manufacturer: 'FAW',
    year: 2020,
    capacityKg: 18000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Marie Niyigena',
      licenseNumber: 'DL-RW-2018-0056',
    },
    status: 'in_transit',
    lastLatitude: -1.9536,
    lastLongitude: 30.0606,
    lastUpdated: new Date(),
    currentRoute: 'kampala-kigali',
    destination: 'Kigali',
  },
  {
    id: 'truck-007',
    plateNumber: 'TZA-456',
    model: 'Jianghuai N-Series',
    manufacturer: 'Jianghuai',
    year: 2021,
    capacityKg: 16000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Juma Hassan',
      licenseNumber: 'DL-TZ-2019-0089',
    },
    status: 'in_transit',
    lastLatitude: -3.3667,
    lastLongitude: 36.6833,
    lastUpdated: new Date(),
    currentRoute: 'nairobi-arusha',
    destination: 'Arusha',
  },
  {
    id: 'truck-008',
    plateNumber: 'KEN-523',
    model: 'MAN TGX',
    manufacturer: 'MAN',
    year: 2023,
    capacityKg: 26000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Frederick Ondiek',
      licenseNumber: 'DL-KE-2021-0023',
    },
    status: 'idle',
    lastLatitude: -1.2921,
    lastLongitude: 36.8219,
    lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
    destination: 'Maintenance',
  },
  {
    id: 'truck-009',
    plateNumber: 'UGA-675',
    model: 'Sinotruk HOWO',
    manufacturer: 'Sinotruk',
    year: 2020,
    capacityKg: 22000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Robert Mutebi',
      licenseNumber: 'DL-UG-2018-0067',
    },
    status: 'in_transit',
    lastLatitude: -1.2921,
    lastLongitude: 36.8219,
    lastUpdated: new Date(),
    currentRoute: 'nairobi-kampala',
    destination: 'Kampala',
  },
  {
    id: 'truck-010',
    plateNumber: 'TZA-789',
    model: 'Kenworth T600',
    manufacturer: 'Kenworth',
    year: 2022,
    capacityKg: 29000,
    fuelType: 'diesel',
    vehicleType: 'truck',
    assignedDriver: {
      name: 'Amina Msuya',
      licenseNumber: 'DL-TZ-2020-0045',
    },
    status: 'in_transit',
    lastLatitude: -6.1719,
    lastLongitude: 35.7395,
    lastUpdated: new Date(),
    currentRoute: 'dar-dodoma',
    destination: 'Dodoma',
  },
];

/**
 * Get a truck by ID
 */
export function getTruckById(id: string): SampleTruck | undefined {
  return SAMPLE_TRUCKS.find((t) => t.id === id);
}

/**
 * Get trucks by status
 */
export function getTrucksByStatus(status: TruckStatus): SampleTruck[] {
  return SAMPLE_TRUCKS.filter((t) => t.status === status);
}

/**
 * Get all trucks
 */
export function getAllTrucks(): SampleTruck[] {
  return SAMPLE_TRUCKS;
}
