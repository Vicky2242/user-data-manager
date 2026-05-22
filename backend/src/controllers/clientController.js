import { Client } from '../models/Client.js';
import { asyncHandler, sendResponse, sendError } from '../utils/errorHandler.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';
import { sanitizeClientData, validateEmail, validatePhone } from '../utils/validators.js';

export const createClient = asyncHandler(async (req, res) => {
  let clientData = sanitizeClientData(req.body);

  if (!clientData.name || !clientData.email || !clientData.phone) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Name, email, and phone are required');
  }

  if (!validateEmail(clientData.email)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid email format');
  }

  if (!validatePhone(clientData.phone)) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Phone must be a 10-digit number');
  }

  const existingClient = await Client.findOne({ email: clientData.email });
  if (existingClient) {
    return sendError(res, HTTP_STATUS.CONFLICT, 'Client with this email already exists');
  }

  clientData.createdBy = req.user.id;

  const client = new Client(clientData);
  await client.save();

  return sendResponse(
    res,
    HTTP_STATUS.CREATED,
    true,
    'Client created successfully',
    { client: client.decryptSensitiveFields() }
  );
});

export const getAllClients = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  let filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const totalClients = await Client.countDocuments(filter);
  const totalPages = Math.ceil(totalClients / limitNum);

  const sortObj = {};
  sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const clients = await Client.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .populate('createdBy', 'name email');

  const decryptedClients = clients.map((client) => client.decryptSensitiveFields());

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    clients: decryptedClients,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalClients,
      pageSize: limitNum,
    },
  });
});

export const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id).populate('createdBy', 'name email');

  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    client: client.decryptSensitiveFields(),
  });
});

export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = sanitizeClientData(req.body);

  if (updateData.email) {
    if (!validateEmail(updateData.email)) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid email format');
    }

    const existingClient = await Client.findOne({
      email: updateData.email,
      _id: { $ne: id },
    });

    if (existingClient) {
      return sendError(res, HTTP_STATUS.CONFLICT, 'Email already in use');
    }
  }

  if (updateData.phone) {
    if (!validatePhone(updateData.phone)) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Phone must be a 10-digit number');
    }
  }

  updateData.lastModifiedBy = req.user.id;

  const client = await Client.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, 'Client updated successfully', {
    client: client.decryptSensitiveFields(),
  });
});

export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hardDelete = false } = req.query;

  if (hardDelete === 'true') {
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
    }
  } else {
    const client = await Client.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!client) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
    }
  }

  return sendResponse(res, HTTP_STATUS.OK, true, 'Client deleted successfully');
});

export const searchClients = asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.query;

  if (!query || query.length < 2) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Search query must be at least 2 characters');
  }

  const clients = await Client.find(
    {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    },
    { name: 1, email: 1, phone: 1, businessName: 1 }
  )
    .limit(Math.min(parseInt(limit, 10), 20));

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    clients,
    count: clients.length,
  });
});

export const bulkUpdateClients = asyncHandler(async (req, res) => {
  const { clientIds, updateData } = req.body;

  if (!Array.isArray(clientIds) || clientIds.length === 0) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Client IDs array is required');
  }

  const sanitized = sanitizeClientData(updateData);
  sanitized.lastModifiedBy = req.user.id;

  const result = await Client.updateMany(
    { _id: { $in: clientIds }, isActive: true },
    sanitized
  );

  return sendResponse(res, HTTP_STATUS.OK, true, 'Clients updated successfully', {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  });
});
