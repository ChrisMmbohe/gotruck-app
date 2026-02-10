/**
 * Sample Shipment Tracking Data
 * Simulates realistic freight shipments for testing
 */

export type ShipmentStatus = 
  | 'pending'
  | 'picked_up'
  | 'in_transit'
  | 'at_border'
  | 'customs'
  | 'delivered'
  | 'delayed'
  | 'cancelled';

export type Currency = 'KES' | 'UGX' | 'TZS';

export interface CargoItem {
  description: string;
  weight: number; // kg
  volume: number; // cubic meters
  quantity: number;
  unitType: string;
  hazardous: boolean;
}

export interface SampleShipment {
  id: string;
  trackingNumber: string;
  origin: {
    city: string;
    country: string;
    address: string;
  };
  destination: {
    city: string;
    country: string;
    address: string;
  };
  carrier: {
    truckId: string;
    driverName: string;
    licensePlate: string;
  };
  cargo: CargoItem[];
  totalWeight: number; // kg
  totalValue: number;
  currency: Currency;
  status: ShipmentStatus;
  pickupDate: Date;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  shipper: {
    name: string;
    phone: string;
    email: string;
  };
  consignee: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const SAMPLE_SHIPMENTS: SampleShipment[] = [
  {
    id: 'ship-001',
    trackingNumber: 'SHP-NAI-KMP-20260207-001',
    origin: {
      city: 'Nairobi',
      country: 'Kenya',
      address: '123 Industrial Park, Athi River',
    },
    destination: {
      city: 'Kampala',
      country: 'Uganda',
      address: '456 Market Street, Kampala CBD',
    },
    carrier: {
      truckId: 'truck-001',
      driverName: 'Samuel Kamau',
      licensePlate: 'KBZ-421',
    },
    cargo: [
      {
        description: 'Packaged Rice - 50kg bags',
        weight: 2500,
        volume: 2.5,
        quantity: 50,
        unitType: 'bags',
        hazardous: false,
      },
      {
        description: 'Steel Building Materials',
        weight: 3500,
        volume: 1.8,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
    ],
    totalWeight: 6000,
    totalValue: 45000,
    currency: 'KES',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    shipper: {
      name: 'Kenya Logistics Ltd',
      phone: '+254700000001',
      email: 'logistics@kenalogs.co.ke',
    },
    consignee: {
      name: 'Uganda Retailers Inc',
      phone: '+256701000001',
      email: 'purchasing@ugretailers.ug',
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-002',
    trackingNumber: 'SHP-MBA-DAR-20260207-002',
    origin: {
      city: 'Mombasa',
      country: 'Kenya',
      address: 'Port Authority, Mombasa Port',
    },
    destination: {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: '789 Customs District, Dar Port',
    },
    carrier: {
      truckId: 'truck-004',
      driverName: 'David Kipchoge',
      licensePlate: 'KEN-847',
    },
    cargo: [
      {
        description: 'Electronics & Computer Parts',
        weight: 1200,
        volume: 1.0,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
      {
        description: 'Textile Rolls',
        weight: 800,
        volume: 0.8,
        quantity: 10,
        unitType: 'rolls',
        hazardous: false,
      },
    ],
    totalWeight: 2000,
    totalValue: 150000,
    currency: 'KES',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
    shipper: {
      name: 'East Africa Import/Export Co',
      phone: '+254412000001',
      email: 'shipping@eaimpex.co.ke',
    },
    consignee: {
      name: 'Tanzania Trade Distributors',
      phone: '+255222000001',
      email: 'warehouse@tztraders.tz',
    },
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-003',
    trackingNumber: 'SHP-NAI-DAR-20260207-003',
    origin: {
      city: 'Nairobi',
      country: 'Kenya',
      address: '100 Warehouse District, Kasarani',
    },
    destination: {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: '200 Customs House Street, Dar',
    },
    carrier: {
      truckId: 'truck-003',
      driverName: 'Grace Mwangi',
      licensePlate: 'TZA-305',
    },
    cargo: [
      {
        description: 'Automotive Parts & Accessories',
        weight: 4000,
        volume: 3.2,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
      {
        description: 'Lubricants (Premium Grade)',
        weight: 2000,
        volume: 1.5,
        quantity: 40,
        unitType: 'drums',
        hazardous: true,
      },
    ],
    totalWeight: 6000,
    totalValue: 200000,
    currency: 'KES',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
    shipper: {
      name: 'AutoParts Kenya Ltd',
      phone: '+254704000001',
      email: 'sales@autopartsKe.co.ke',
    },
    consignee: {
      name: 'Tanzania Auto Distributors',
      phone: '+255787000001',
      email: 'warehouse@tzauto.tz',
    },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-004',
    trackingNumber: 'SHP-KMP-KGL-20260207-004',
    origin: {
      city: 'Kampala',
      country: 'Uganda',
      address: '300 Industrial Zone, Kampala',
    },
    destination: {
      city: 'Kigali',
      country: 'Rwanda',
      address: '400 Commerce Street, Kigali',
    },
    carrier: {
      truckId: 'truck-006',
      driverName: 'Marie Niyigena',
      licensePlate: 'RWA-112',
    },
    cargo: [
      {
        description: 'Dried & Processed Agricultural Products',
        weight: 3000,
        volume: 2.8,
        quantity: 60,
        unitType: 'bags',
        hazardous: false,
      },
    ],
    totalWeight: 3000,
    totalValue: 1800000,
    currency: 'UGX',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    shipper: {
      name: 'Uganda Agro Exports Ltd',
      phone: '+256701000002',
      email: 'export@ugagro.ug',
    },
    consignee: {
      name: 'Rwanda Agricultural Importers',
      phone: '+250788000001',
      email: 'imports@rwagri.rw',
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-005',
    trackingNumber: 'SHP-NAI-ARS-20260207-005',
    origin: {
      city: 'Nairobi',
      country: 'Kenya',
      address: '500 Export Complex, JKIA',
    },
    destination: {
      city: 'Arusha',
      country: 'Tanzania',
      address: '600 Trade Center, Arusha',
    },
    carrier: {
      truckId: 'truck-007',
      driverName: 'Juma Hassan',
      licensePlate: 'TZA-456',
    },
    cargo: [
      {
        description: 'Flowers - Fresh Cut (Refrigerated)',
        weight: 500,
        volume: 0.6,
        quantity: 1,
        unitType: 'container',
        hazardous: false,
      },
      {
        description: 'Horticultural Seeds & Bulbs',
        weight: 300,
        volume: 0.3,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
    ],
    totalWeight: 800,
    totalValue: 85000,
    currency: 'KES',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    shipper: {
      name: 'Kenya Horticultural Exporters',
      phone: '+254705000001',
      email: 'export@kehorex.co.ke',
    },
    consignee: {
      name: 'Tanzania Flower & Garden Retailers',
      phone: '+255754000001',
      email: 'sourcing@tzflowers.tz',
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-006',
    trackingNumber: 'SHP-DAR-DDM-20260206-006',
    origin: {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: '700 Port District, Dar',
    },
    destination: {
      city: 'Dodoma',
      country: 'Tanzania',
      address: '800 Central Region, Dodoma',
    },
    carrier: {
      truckId: 'truck-010',
      driverName: 'Amina Msuya',
      licensePlate: 'TZA-789',
    },
    cargo: [
      {
        description: 'Government Supplies & Office Equipment',
        weight: 2500,
        volume: 2.0,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
      {
        description: 'Stationery & Printing Supplies',
        weight: 500,
        volume: 0.5,
        quantity: 10,
        unitType: 'boxes',
        hazardous: false,
      },
    ],
    totalWeight: 3000,
    totalValue: 4500000,
    currency: 'TZS',
    status: 'in_transit',
    pickupDate: new Date(Date.now() - 18 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
    shipper: {
      name: 'East Africa Government Contractor',
      phone: '+255654000001',
      email: 'supply@eagovcontract.tz',
    },
    consignee: {
      name: 'Tanzania Government Procurement',
      phone: '+255652000001',
      email: 'receiving@tz-gov.tz',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'ship-007',
    trackingNumber: 'SHP-NAI-KMP-20260206-007',
    origin: {
      city: 'Nairobi',
      country: 'Kenya',
      address: '150 Fashion District, Nairobi',
    },
    destination: {
      city: 'Kampala',
      country: 'Uganda',
      address: '250 Retail Hub, Kampala',
    },
    carrier: {
      truckId: 'truck-009',
      driverName: 'Robert Mutebi',
      licensePlate: 'UGA-675',
    },
    cargo: [
      {
        description: 'Apparel & Fashion Items',
        weight: 800,
        volume: 1.2,
        quantity: 1,
        unitType: 'pallet',
        hazardous: false,
      },
      {
        description: 'Shoes & Footwear',
        weight: 400,
        volume: 0.6,
        quantity: 2,
        unitType: 'pallets',
        hazardous: false,
      },
    ],
    totalWeight: 1200,
    totalValue: 125000,
    currency: 'KES',
    status: 'delivered',
    pickupDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actualDeliveryDate: new Date(Date.now() - 20 * 60 * 60 * 1000),
    shipper: {
      name: 'Kenya Fashion Distributors',
      phone: '+254707000001',
      email: 'sales@kenafashion.co.ke',
    },
    consignee: {
      name: 'Uganda Style Retailers',
      phone: '+256703000001',
      email: 'inventory@ugstyle.ug',
    },
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 'ship-008',
    trackingNumber: 'SHP-MBA-DAR-20260206-008',
    origin: {
      city: 'Mombasa',
      country: 'Kenya',
      address: 'Port Authority Terminal 1',
    },
    destination: {
      city: 'Nairobi',
      country: 'Kenya',
      address: '600 Distribution Center, Nairobi',
    },
    carrier: {
      truckId: 'truck-004',
      driverName: 'David Kipchoge',
      licensePlate: 'KEN-847',
    },
    cargo: [
      {
        description: 'Container Port Cargo - Mixed',
        weight: 18000,
        volume: 15.0,
        quantity: 1,
        unitType: '20ft-container',
        hazardous: false,
      },
    ],
    totalWeight: 18000,
    totalValue: 500000,
    currency: 'KES',
    status: 'delivered',
    pickupDate: new Date(Date.now() - 72 * 60 * 60 * 1000),
    estimatedDeliveryDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    actualDeliveryDate: new Date(Date.now() - 40 * 60 * 60 * 1000),
    shipper: {
      name: 'International Freight Services',
      phone: '+254411000001',
      email: 'shipping@intfreight.co.ke',
    },
    consignee: {
      name: 'Kenya Central Warehouse',
      phone: '+254702000001',
      email: 'receiving@kenyawarehouse.co.ke',
    },
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 40 * 60 * 60 * 1000),
  },
];

/**
 * Get a shipment by ID
 */
export function getShipmentById(id: string): SampleShipment | undefined {
  return SAMPLE_SHIPMENTS.find((s) => s.id === id);
}

/**
 * Get shipments by status
 */
export function getShipmentsByStatus(status: ShipmentStatus): SampleShipment[] {
  return SAMPLE_SHIPMENTS.filter((s) => s.status === status);
}

/**
 * Get shipments assigned to a truck
 */
export function getShipmentsByTruck(truckId: string): SampleShipment[] {
  return SAMPLE_SHIPMENTS.filter((s) => s.carrier.truckId === truckId);
}

/**
 * Get all active shipments (in transit)
 */
export function getActiveShipments(): SampleShipment[] {
  return SAMPLE_SHIPMENTS.filter(
    (s) =>
      s.status === 'in_transit' ||
      s.status === 'picked_up' ||
      s.status === 'at_border' ||
      s.status === 'customs'
  );
}
