import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error.message);
  process.exit(1);
});
