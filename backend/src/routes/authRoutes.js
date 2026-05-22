import express from 'express';
import {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import {
  validateSignup,
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
} from '../middleware/validators.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, validateChangePassword, handleValidationErrors, changePassword);

export default router;
