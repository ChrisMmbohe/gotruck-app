import { Schema, model, Types, Document } from 'mongoose';
import { Truck as TruckType } from '../../../types/database';

export interface TruckDocument extends TruckType, Document {}

const TruckSchema = new Schema<TruckDocument>({
  plateNumber: { type: String, required: true, unique: true, trim: true, index: true },
  model: { type: String, required: true },
  manufacturer: { type: String, required: true },
  year: { type: Number, required: true },
  capacityKg: { type: Number, required: true },
  fuelType: { type: String, required: true },
  assignedDriver: { type: Types.ObjectId, ref: 'Driver' },
  status: { type: String, enum: ['available', 'in_transit', 'maintenance', 'inactive'], default: 'available' },
  documents: [{ type: String }],
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
TruckSchema.plugin(softDeletePlugin);
TruckSchema.plugin(auditTrailPlugin);

TruckSchema.index({ plateNumber: 1 });
TruckSchema.index({ status: 1 });
TruckSchema.index({ isDeleted: 1 });

export const Truck = model<TruckDocument>('Truck', TruckSchema);