import express from 'express';
import { prisma } from '../app.js';

const router = express.Router();

// Получить все направления
router.get('/directions', async (req, res) => {
  try {
    const directions = await prisma.direction.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(directions);
  } catch (error) {
    console.error('Get directions error:', error);
    res.status(500).json({ error: 'Ошибка получения направлений' });
  }
});

// Получить все способы перевозки
router.get('/transport-methods', async (req, res) => {
  try {
    const methods = await prisma.transportMethod.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(methods);
  } catch (error) {
    console.error('Get transport methods error:', error);
    res.status(500).json({ error: 'Ошибка получения способов перевозки' });
  }
});

export default router;