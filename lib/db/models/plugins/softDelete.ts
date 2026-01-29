import { Schema } from 'mongoose';

export function softDeletePlugin(schema: Schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.statics.findNotDeleted = function (filter = {}) {
    return this.find({ ...filter, isDeleted: false });
  };

  schema.pre('find', function () {
    this.where({ isDeleted: false });
  });
  schema.pre('findOne', function () {
    this.where({ isDeleted: false });
  });
  schema.pre('count', function () {
    this.where({ isDeleted: false });
  });
  schema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
  });
}
