import { verifyToken } from '../services/jwtService.js';
import { sendError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      const cookieToken = req.cookies.authToken;
      if (!cookieToken) {
        return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'No token provided');
      }
      return verifyAndProceed(cookieToken, req, res, next);
    }

    verifyAndProceed(token, req, res, next);
  } catch (error) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Authentication failed', error.message);
  }
};

const verifyAndProceed = (token, req, res, next) => {
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, error.message);
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authenticated');
    }

    if (req.user.role && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      return sendError(res, HTTP_STATUS.FORBIDDEN, 'Admin access required');
    }

    next();
  } catch (error) {
    return sendError(res, HTTP_STATUS.FORBIDDEN, 'Authorization failed');
  }
};

export const isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authenticated');
    }

    if (req.user.role !== 'super-admin') {
      return sendError(res, HTTP_STATUS.FORBIDDEN, 'Super Admin access required');
    }

    next();
  } catch (error) {
    return sendError(res, HTTP_STATUS.FORBIDDEN, 'Authorization failed');
  }
};
