import { CustomField } from '../models/CustomField.js';
import { asyncHandler, sendResponse, sendError } from '../utils/errorHandler.js';
import { HTTP_STATUS, MESSAGES, CUSTOM_FIELD_TYPES } from '../config/constants.js';

export const createCustomField = asyncHandler(async (req, res) => {
  const { name, fieldKey, fieldType, description, isRequired, options, validation, order } = req.body;

  if (!name || !fieldKey || !fieldType) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Name, field key, and field type are required');
  }

  if (!CUSTOM_FIELD_TYPES.includes(fieldType)) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      `Field type must be one of: ${CUSTOM_FIELD_TYPES.join(', ')}`
    );
  }

  const existingField = await CustomField.findOne({ fieldKey });
  if (existingField) {
    return sendError(res, HTTP_STATUS.CONFLICT, 'Field key already exists');
  }

  const fieldData = {
    name,
    fieldKey,
    fieldType,
    description,
    isRequired: isRequired || false,
    createdBy: req.user.id,
  };

  if (options && Array.isArray(options)) {
    fieldData.options = options;
  }

  if (validation) {
    fieldData.validation = validation;
  }

  if (order !== undefined) {
    fieldData.order = order;
  }

  const customField = new CustomField(fieldData);
  await customField.save();

  return sendResponse(
    res,
    HTTP_STATUS.CREATED,
    true,
    'Custom field created successfully',
    { field: customField }
  );
});

export const getAllCustomFields = asyncHandler(async (req, res) => {
  const { includeInactive = false } = req.query;

  const filter = {};
  if (includeInactive !== 'true') {
    filter.isActive = true;
  }

  const fields = await CustomField.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .populate('createdBy', 'name email');

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    fields,
    count: fields.length,
  });
});

export const getCustomFieldById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const field = await CustomField.findById(id).populate('createdBy', 'name email');

  if (!field) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Custom field not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    field,
  });
});

export const updateCustomField = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, isRequired, options, validation, order, isActive } = req.body;

  const field = await CustomField.findById(id);
  if (!field) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Custom field not found');
  }

  if (name) field.name = name;
  if (description !== undefined) field.description = description;
  if (isRequired !== undefined) field.isRequired = isRequired;
  if (isActive !== undefined) field.isActive = isActive;
  if (order !== undefined) field.order = order;
  if (options && Array.isArray(options)) field.options = options;
  if (validation) field.validation = validation;

  field.lastModifiedBy = req.user.id;
  await field.save();

  return sendResponse(res, HTTP_STATUS.OK, true, 'Custom field updated successfully', {
    field,
  });
});

export const deleteCustomField = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hardDelete = false } = req.query;

  if (hardDelete === 'true') {
    const field = await CustomField.findByIdAndDelete(id);
    if (!field) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Custom field not found');
    }
  } else {
    const field = await CustomField.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!field) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Custom field not found');
    }
  }

  return sendResponse(res, HTTP_STATUS.OK, true, 'Custom field deleted successfully');
});

export const reorderCustomFields = asyncHandler(async (req, res) => {
  const { fieldOrders } = req.body;

  if (!Array.isArray(fieldOrders) || fieldOrders.length === 0) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Field orders array is required');
  }

  const updates = fieldOrders.map((item, index) => ({
    updateOne: {
      filter: { _id: item.fieldId },
      update: { $set: { order: index } },
    },
  }));

  await CustomField.bulkWrite(updates);

  return sendResponse(res, HTTP_STATUS.OK, true, 'Custom fields reordered successfully');
});

export const duplicateCustomField = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const field = await CustomField.findById(id);
  if (!field) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Custom field not found');
  }

  const newFieldKey = `${field.fieldKey}_copy_${Date.now()}`;

  const newField = new CustomField({
    name: `${field.name} (Copy)`,
    fieldKey: newFieldKey,
    fieldType: field.fieldType,
    description: field.description,
    isRequired: field.isRequired,
    options: field.options,
    validation: field.validation,
    order: field.order + 1,
    createdBy: req.user.id,
  });

  await newField.save();

  return sendResponse(
    res,
    HTTP_STATUS.CREATED,
    true,
    'Custom field duplicated successfully',
    { field: newField }
  );
});

export const bulkUpdateCustomFields = asyncHandler(async (req, res) => {
  const { fieldIds, isActive } = req.body;

  if (!Array.isArray(fieldIds) || fieldIds.length === 0) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Field IDs array is required');
  }

  const result = await CustomField.updateMany(
    { _id: { $in: fieldIds } },
    { isActive, lastModifiedBy: req.user.id }
  );

  return sendResponse(res, HTTP_STATUS.OK, true, 'Custom fields updated successfully', {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  });
});
