import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import { serverConfig, corsConfig, httpsConfig } from './config/server.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error/errorMiddleware.js';
import adminUsersRoutes from './routes/admin/users.js';
import adminDictionariesRoutes from './routes/admin/dictionaries.js';
import adminAnalyticsRoutes from './routes/admin/analytics.js';
import adminSettingsRoutes from './routes/admin/settings.js';

// Routes
import authRoutes from './routes/auth/authRoutes.js';
import vehicleRoutes from './routes/vehicle/vehicleRoutes.js';
import vehicleActRoutes from './routes/vehicle/vehicleActRoutes.js';
import dictionaryRoutes from './routes/dictionary/dictionaryRoutes.js';

// Initialize
dotenv.config();
const app = express();
const PORT = serverConfig.port;

// Middleware
app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/vehicle-acts', vehicleActRoutes);
app.use('/api/dictionaries', dictionaryRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/dictionaries', adminDictionariesRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api', dictionaryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Uchet_TS backend is running!' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { testDatabaseConnection } = await import('./utils/database.js');
    const result = await testDatabaseConnection();
    res.json({ 
      status: 'DB Connection OK', 
      result,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    logger.error('Database connection test failed:', error);
    res.status(500).json({ 
      status: 'DB Connection FAILED', 
      error: error.message 
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling
app.use(errorHandler);

// Create HTTPS server
const server = https.createServer(httpsConfig, app);

// Start server
server.listen(PORT, () => {
  logger.info(`HTTPS Server running on port ${PORT}`);
  console.log(`HTTPS Server available on: https://localhost:${PORT}`);
  console.log(`Note: You may need to accept the self-signed certificate in your browser`);
});

export default app;