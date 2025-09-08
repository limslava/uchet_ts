import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import https from 'https';
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

// Пути к SSL сертификатам
const sslOptions = {
  key: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost+3-key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost+3.pem'))
};

// Инициализация Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: true, // ← Разрешает все домены
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

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`HTTPS Server is running on port ${PORT}`);
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
  console.log(`Also available on https://192.168.0.121:${PORT}`);
});

// Также запускаем HTTP сервер для обратной совместимости (на другом порту)
const HTTP_PORT = 8080;
app.listen(HTTP_PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${HTTP_PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});