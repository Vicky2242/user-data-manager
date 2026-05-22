import express from 'express';
import { upload } from '../utils/fileUpload.js';
import {
  uploadDocuments,
  deleteDocument,
  downloadDocument,
  exportClientsToCSV,
  exportClientsToPDF,
  getClientDocuments,
} from '../controllers/exportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/clients/:id/upload', upload.single('document'), uploadDocuments);
router.delete('/clients/:id/documents/:docId', deleteDocument);
router.get('/clients/:id/documents/:docId/download', downloadDocument);
router.get('/clients/:id/documents', getClientDocuments);

router.get('/csv', exportClientsToCSV);
router.get('/pdf', exportClientsToPDF);

export default router;
