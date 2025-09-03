console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('Routes loaded:');
console.log('- /api/auth');
console.log('- /api/vehicles'); 
console.log('- /api/inspections');
console.log('- /vehicle-acts'); // Добавьте эту строку

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // ✅ ДОБАВЬТЕ ЭТОТ ИМПОРТ
import { logger } from './config/logger.js';
import { PrismaClient } from '@prisma/client';
import vehicleActRoutes from './routes/vehicleActs.js';

// Конфигурация
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация Prisma Client
export const prisma = new PrismaClient();
// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // URL вашего React-приложения
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware - ДОБАВЬТЕ ЭТУ СТРОКУ
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Import routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import inspectionRoutes from './routes/inspections.js'; // ← Должен быть этот импорт

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes); // ← И это использование
app.use('/vehicle-acts', vehicleActRoutes);

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
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});