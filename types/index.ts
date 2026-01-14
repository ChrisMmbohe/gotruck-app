export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "driver" | "shipper";
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: "active" | "maintenance" | "inactive";
  currentLocation?: GeoLocation;
  driverId?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: Location;
  destination: Location;
  status: "pending" | "in-transit" | "delivered" | "cancelled";
  vehicleId?: string;
  driverId?: string;
  cargo: CargoDetails;
  customsDocuments: Document[];
  estimatedDelivery: Date;
  actualDelivery?: Date;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address: string;
  city: string;
  country: "Kenya" | "Uganda" | "Tanzania" | "Rwanda" | "Burundi" | "South Sudan";
  coordinates: GeoLocation;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

export interface CargoDetails {
  description: string;
  weight: number;
  volume: number;
  value: number;
  currency: "KES" | "UGX" | "TZS";
  hazardous: boolean;
}

export interface Document {
  id: string;
  type: "invoice" | "customs" | "insurance" | "manifest";
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface Transaction {
  id: string;
  shipmentId: string;
  amount: number;
  currency: "KES" | "UGX" | "TZS";
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  stripePaymentId?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteAnalytics {
  routeId: string;
  distance: number;
  estimatedDuration: number;
  fuelConsumption: number;
  borderCrossings: BorderCrossing[];
  weatherConditions: WeatherData[];
  trafficData: TrafficData[];
}

export interface BorderCrossing {
  name: string;
  country1: string;
  country2: string;
  coordinates: GeoLocation;
  averageWaitTime: number;
  requiredDocuments: string[];
}

export interface WeatherData {
  location: GeoLocation;
  temperature: number;
  conditions: string;
  timestamp: Date;
}

export interface TrafficData {
  location: GeoLocation;
  congestionLevel: "low" | "medium" | "high";
  timestamp: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: "routine" | "repair" | "inspection";
  description: string;
  cost: number;
  currency: "KES" | "UGX" | "TZS";
  scheduledDate: Date;
  completedDate?: Date;
  nextServiceDate?: Date;
  status: "scheduled" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
