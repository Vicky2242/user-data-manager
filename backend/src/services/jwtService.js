import jwt from 'jsonwebtoken';

export const generateToken = (adminId, email) => {
  return jwt.sign(
    { id: adminId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
