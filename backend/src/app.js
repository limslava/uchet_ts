import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from './config/logger.js';
import { PrismaClient } from '@prisma/client';

// Импорты роутов ДОЛЖНЫ БЫТЬ ЗДЕСЬ
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import inspectionRoutes from './routes/inspections.js';
import vehicleActRoutes from './routes/vehicleActs.js';
import dictionariesRoutes from './routes/dictionaries.js';
import carBrandsRoutes from './routes/carBrands.js';

// Конфигурация
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Инициализация Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.121:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Use routes - ПОДКЛЮЧАЕМ ВСЕ РОУТЫ
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/vehicle-acts', vehicleActRoutes);
app.use('/api/dictionaries', dictionariesRoutes);
app.use('/api/car-brands', carBrandsRoutes);

// ✅ ТЕПЕРЬ выводим список всех загруженных роутов
console.log('Routes loaded:');
console.log('- /api/auth');
console.log('- /api/vehicles'); 
console.log('- /api/inspections');
console.log('- /vehicle-acts');
console.log('- /api/dictionaries');
console.log('- /api/car-brands');

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