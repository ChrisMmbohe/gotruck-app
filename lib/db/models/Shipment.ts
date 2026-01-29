import { Schema, model, Types, Document } from 'mongoose';
import { Shipment as ShipmentType } from '../../../types/database';

export interface ShipmentDocument extends ShipmentType, Document {}

const ShipmentSchema = new Schema<ShipmentDocument>({
  customer: { type: Types.ObjectId, ref: 'Customer', required: true, index: true },
  truck: { type: Types.ObjectId, ref: 'Truck', required: true },
  driver: { type: Types.ObjectId, ref: 'Driver', required: true },
  route: { type: Types.ObjectId, ref: 'Route', required: true },
  cargoDescription: { type: String, required: true },
  cargoWeightKg: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in_transit', 'at_border', 'customs', 'delivered', 'cancelled'], default: 'pending', index: true },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date },
  freightLogs: [{ type: Types.ObjectId, ref: 'FreightLog' }],
  documents: [{ type: String }],
  price: { type: Number },
  currency: { type: String },
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
ShipmentSchema.plugin(softDeletePlugin);
ShipmentSchema.plugin(auditTrailPlugin);

ShipmentSchema.index({ customer: 1 });
ShipmentSchema.index({ status: 1 });
ShipmentSchema.index({ isDeleted: 1 });

export const Shipment = model<ShipmentDocument>('Shipment', ShipmentSchema);