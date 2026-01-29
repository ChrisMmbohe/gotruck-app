import { Schema, model, Types, Document } from 'mongoose';
import { Driver as DriverType } from '../../../types/database';

export interface DriverDocument extends DriverType, Document {}

const DriverSchema = new Schema<DriverDocument>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, index: true },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  licenseExpiry: { type: Date, required: true },
  assignedTruck: { type: Types.ObjectId, ref: 'Truck' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  photoUrl: { type: String },
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
DriverSchema.plugin(softDeletePlugin);
DriverSchema.plugin(auditTrailPlugin);

DriverSchema.index({ phone: 1 });
DriverSchema.index({ licenseNumber: 1 });
DriverSchema.index({ isDeleted: 1 });

export const Driver = model<DriverDocument>('Driver', DriverSchema);