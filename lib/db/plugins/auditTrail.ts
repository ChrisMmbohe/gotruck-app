import { Schema, Types } from 'mongoose';

/**
 * Mongoose plugin to add audit trail fields and auto-update them.
 * Adds createdBy, updatedBy, createdAt, updatedAt fields.
 * Optionally, pass userId to set updatedBy/createdBy.
 */
export function auditTrailPlugin(schema: Schema) {
  schema.add({
    createdBy: { type: Types.ObjectId, ref: 'User' },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  schema.pre('save', function (next) {
    if (this.isNew) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
  });
}
