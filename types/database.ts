import { Types } from 'mongoose';

export type ObjectId = Types.ObjectId;

export interface AuditTrail {
  createdBy?: ObjectId;
  updatedBy?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

// Customer (Shipper) interface
export interface Customer extends AuditTrail {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  verified?: boolean;
}

// Driver interface
export interface Driver extends AuditTrail {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  assignedTruck?: ObjectId;
  status?: 'active' | 'inactive' | 'suspended';
  photoUrl?: string;
}

// Truck interface
export interface Truck extends AuditTrail {
  _id?: ObjectId;
  plateNumber: string;
  model: string;
  manufacturer: string;
  year: number;
  capacityKg: number;
  fuelType: string;
  assignedDriver?: ObjectId;
  status?: 'available' | 'in_transit' | 'maintenance' | 'inactive';
  documents?: string[];
}

// Route interface
export interface Route extends AuditTrail {
  _id?: ObjectId;
  origin: string;
  destination: string;
  waypoints?: string[];
  distanceKm?: number;
  estimatedTimeHrs?: number;
  active?: boolean;
}

// Shipment interface
export interface Shipment extends AuditTrail {
  _id?: ObjectId;
  customer: ObjectId;
  truck: ObjectId;
  driver: ObjectId;
  route: ObjectId;
  cargoDescription: string;
  cargoWeightKg: number;
  status: 'pending' | 'in_transit' | 'at_border' | 'customs' | 'delivered' | 'cancelled';
  pickupDate: Date;
  deliveryDate?: Date;
  freightLogs?: ObjectId[];
  documents?: string[];
  price?: number;
  currency?: string;
}

// FreightLog interface
export interface FreightLog extends AuditTrail {
  _id?: ObjectId;
  shipment: ObjectId;
  timestamp: Date;
  location: string;
  status: string;
  notes?: string;
  gps?: {
    lat: number;
    lng: number;
  };
}