import { Client } from '../models/Client.js';
import { asyncHandler, sendResponse, sendError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import { exportToCSV, exportToPDF } from '../services/exportService.js';
import { deleteFile } from '../utils/fileUpload.js';
import fs from 'fs';
import path from 'path';

export const uploadDocuments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { documentType } = req.body;

  if (!req.file) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'No file uploaded');
  }

  const client = await Client.findById(id);
  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  const document = {
    type: documentType || 'other',
    fileName: req.file.originalname,
    filePath: req.file.path.replace(/\\/g, '/'),
    uploadedAt: new Date(),
  };

  client.documents.push(document);
  await client.save();

  return sendResponse(res, HTTP_STATUS.CREATED, true, 'Document uploaded successfully', {
    document,
    client: client.decryptSensitiveFields(),
  });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { id, docId } = req.params;

  const client = await Client.findById(id);
  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  const documentIndex = client.documents.findIndex((doc) => doc._id.toString() === docId);
  if (documentIndex === -1) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Document not found');
  }

  const document = client.documents[documentIndex];
  deleteFile(document.filePath);

  client.documents.splice(documentIndex, 1);
  await client.save();

  return sendResponse(res, HTTP_STATUS.OK, true, 'Document deleted successfully');
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const { id, docId } = req.params;

  const client = await Client.findById(id);
  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  const document = client.documents.find((doc) => doc._id.toString() === docId);
  if (!document) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Document not found');
  }

  if (!fs.existsSync(document.filePath)) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'File not found on server');
  }

  res.download(document.filePath, document.fileName);
});

export const exportClientsToCSV = asyncHandler(async (req, res) => {
  const { clientIds = null } = req.query;

  let filter = { isActive: true };

  if (clientIds) {
    const ids = clientIds.split(',');
    filter._id = { $in: ids };
  }

  const clients = await Client.find(filter);

  if (clients.length === 0) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'No clients found to export');
  }

  const filename = `clients-export-${Date.now()}.csv`;
  const filepath = path.join(process.cwd(), filename);

  await exportToCSV(clients, filepath);

  res.download(filepath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    deleteFile(filepath);
  });
});

export const exportClientsToPDF = asyncHandler(async (req, res) => {
  const { clientIds = null } = req.query;

  let filter = { isActive: true };

  if (clientIds) {
    const ids = clientIds.split(',');
    filter._id = { $in: ids };
  }

  const clients = await Client.find(filter);

  if (clients.length === 0) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'No clients found to export');
  }

  const filename = `clients-report-${Date.now()}.pdf`;
  const filepath = path.join(process.cwd(), filename);

  await exportToPDF(clients, filepath);

  res.download(filepath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    deleteFile(filepath);
  });
});

export const getClientDocuments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id).select('name documents');

  if (!client) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Client not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, 'Documents retrieved', {
    documents: client.documents,
    count: client.documents.length,
  });
});
