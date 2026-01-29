import { Schema, model, Types, Document } from 'mongoose';
import { Customer as CustomerType } from '../../../types/database';

export interface CustomerDocument extends CustomerType, Document {}

const CustomerSchema = new Schema<CustomerDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true, index: true },
  address: { type: String },
  company: { type: String },
  verified: { type: Boolean, default: false },
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
CustomerSchema.plugin(softDeletePlugin);
CustomerSchema.plugin(auditTrailPlugin);

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ isDeleted: 1 });

export const Customer = model<CustomerDocument>('Customer', CustomerSchema);