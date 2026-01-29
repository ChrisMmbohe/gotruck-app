import { Schema } from 'mongoose';

export function auditTrailPlugin(schema: Schema) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  });

  schema.pre('save', function (next) {
    this.updatedAt = new Date();
    if (this.isNew) {
      this.createdAt = this.updatedAt;
    }
    next();
  });
}
