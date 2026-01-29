import { Schema } from 'mongoose';

/**
 * Mongoose plugin to add soft delete functionality.
 * Adds an isDeleted field and overrides find/findOne/update queries to exclude deleted docs by default.
 */
export function softDeletePlugin(schema: Schema) {
  schema.add({ isDeleted: { type: Boolean, default: false, index: true } });

  // Add a soft delete method
  schema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
  };

  // Exclude deleted docs by default
  function excludeDeleted(this: any, next: Function) {
    if (!this.getQuery().hasOwnProperty('isDeleted')) {
      this.where({ isDeleted: false });
    }
    next();
  }

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('count', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);
}
