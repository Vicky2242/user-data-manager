import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
  bulkUpdateClients,
} from '../controllers/clientController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createClient);
router.get('/', getAllClients);
router.get('/search', searchClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.post('/bulk/update', bulkUpdateClients);

export default router;
