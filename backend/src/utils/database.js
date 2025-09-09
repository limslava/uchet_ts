// backend/src/utils/database.js
import { PrismaClient } from '@prisma/client';

// Глобальный экземпляр Prisma Client для предотвращения множественных подключений
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Функция для тестирования подключения к БД
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    return { 
      status: 'Connected successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// Экспортируем по умолчанию
export default prisma;