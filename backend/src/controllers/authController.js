import { Admin } from '../models/Admin.js';
import { generateToken } from '../services/jwtService.js';
import { asyncHandler, sendResponse, sendError } from '../utils/errorHandler.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'All fields are required');
  }

  if (password !== confirmPassword) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Passwords do not match');
  }

  if (password.length < 6) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Password must be at least 6 characters');
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return sendError(res, HTTP_STATUS.CONFLICT, 'Email already registered');
  }

  const newAdmin = new Admin({
    name,
    email,
    password,
  });

  await newAdmin.save();

  const token = generateToken(newAdmin._id, newAdmin.email);

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(
    res,
    HTTP_STATUS.CREATED,
    true,
    'Admin account created successfully',
    {
      admin: newAdmin.toJSON(),
      token,
    }
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Email and password are required');
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!admin.isActive) {
    return sendError(res, HTTP_STATUS.FORBIDDEN, 'Account is disabled');
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    admin.loginAttempts += 1;

    if (admin.loginAttempts >= 5) {
      admin.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await admin.save();
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return sendError(res, HTTP_STATUS.FORBIDDEN, 'Account is locked. Try again later.');
  }

  admin.loginAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin._id, admin.email);

  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, HTTP_STATUS.OK, true, 'Login successful', {
    admin: admin.toJSON(),
    token,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('authToken');
  return sendResponse(res, HTTP_STATUS.OK, true, 'Logout successful');
});

export const getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, MESSAGES.SUCCESS, {
    admin: admin.toJSON(),
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const admin = await Admin.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );

  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  return sendResponse(res, HTTP_STATUS.OK, true, 'Profile updated successfully', {
    admin: admin.toJSON(),
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'All fields are required');
  }

  if (newPassword !== confirmPassword) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'New passwords do not match');
  }

  const admin = await Admin.findById(req.user.id).select('+password');

  if (!admin) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Admin not found');
  }

  const isPasswordValid = await admin.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  return sendResponse(res, HTTP_STATUS.OK, true, 'Password changed successfully');
});
