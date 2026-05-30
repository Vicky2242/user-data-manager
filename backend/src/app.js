import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import customFieldRoutes from './routes/customFieldRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(morgan('combined'));

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000','https://user-data-manager-five.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/clients', apiLimiter, clientRoutes);
app.use('/api/custom-fields', apiLimiter, customFieldRoutes);
app.use('/api/export', apiLimiter, exportRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
