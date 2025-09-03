console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './config/logger.js';
import { PrismaClient } from '@prisma/client';

console.log('Routes loaded:');
console.log('- /api/auth');
console.log('- /api/vehicles'); 
console.log('- /api/inspections');

// Конфигурация
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация Prisma Client
export const prisma = new PrismaClient();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Basic request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Import routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import inspectionRoutes from './routes/inspections.js'; // ← Должен быть этот импорт

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes); // ← И это использование

// ... остальной код
// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Uchet_TS backend is running!' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    // Простой запрос чтобы проверить подключение к БД
    const result = await prisma.$queryRaw`SELECT 1 as test`;
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

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});