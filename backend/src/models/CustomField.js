import mongoose from 'mongoose';
import { CUSTOM_FIELD_TYPES } from '../config/constants.js';

const customFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Field name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    fieldKey: {
      type: String,
      required: [true, 'Field key is required'],
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9_]+$/, 'Field key must be lowercase alphanumeric with underscores'],
    },
    description: {
      type: String,
      trim: true,
    },
    fieldType: {
      type: String,
      enum: CUSTOM_FIELD_TYPES,
      required: [true, 'Field type is required'],
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    options: {
      type: [String],
      default: [],
    },
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String,
      min: Number,
      max: Number,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

customFieldSchema.index({ isActive: 1, order: 1 });

export const CustomField = mongoose.model('CustomField', customFieldSchema);
