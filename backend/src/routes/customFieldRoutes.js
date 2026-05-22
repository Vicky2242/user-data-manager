import express from 'express';
import {
  createCustomField,
  getAllCustomFields,
  getCustomFieldById,
  updateCustomField,
  deleteCustomField,
  reorderCustomFields,
  duplicateCustomField,
  bulkUpdateCustomFields,
} from '../controllers/customFieldController.js';
import { authenticateToken, isSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createCustomField);
router.get('/', getAllCustomFields);
router.get('/:id', getCustomFieldById);
router.put('/:id', updateCustomField);
router.delete('/:id', deleteCustomField);
router.post('/reorder', reorderCustomFields);
router.post('/:id/duplicate', duplicateCustomField);
router.post('/bulk/update', bulkUpdateCustomFields);

export default router;
