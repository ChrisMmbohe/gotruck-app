import { Schema, model, Document } from 'mongoose';
import { Route as RouteType } from '../../../types/database';

export interface RouteDocument extends RouteType, Document {}

const RouteSchema = new Schema<RouteDocument>({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  waypoints: [{ type: String }],
  distanceKm: { type: Number },
  estimatedTimeHrs: { type: Number },
  active: { type: Boolean, default: true },
});


import { softDeletePlugin } from './plugins/softDelete';
import { auditTrailPlugin } from './plugins/auditTrail';
RouteSchema.plugin(softDeletePlugin);
RouteSchema.plugin(auditTrailPlugin);

RouteSchema.index({ origin: 1, destination: 1 });
RouteSchema.index({ isDeleted: 1 });

export const Route = model<RouteDocument>('Route', RouteSchema);