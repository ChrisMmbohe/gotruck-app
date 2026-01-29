import { Schema, model, Types, Document } from 'mongoose';
import { FreightLog as FreightLogType } from '../../../types/database';

export interface FreightLogDocument extends FreightLogType, Document {}

const FreightLogSchema = new Schema<FreightLogDocument>({
  shipment: { type: Types.ObjectId, ref: 'Shipment', required: true, index: true },
  timestamp: { type: Date, required: true, default: Date.now },
  location: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: String },
  gps: {
    lat: { type: Number },
    lng: { type: Number },
  },
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
FreightLogSchema.plugin(softDeletePlugin);
FreightLogSchema.plugin(auditTrailPlugin);

FreightLogSchema.index({ shipment: 1, timestamp: -1 });
FreightLogSchema.index({ isDeleted: 1 });

export const FreightLog = model<FreightLogDocument>('FreightLog', FreightLogSchema);