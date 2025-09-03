import express from 'express';
import { prisma } from '../app.js';

const router = express.Router();

// Получить все марки
router.get('/', async (req, res) => {
  try {
    const brands = await prisma.carBrand.findMany({
      orderBy: { name: 'asc' },
      include: {
        models: {
          orderBy: { name: 'asc' }
        }
      }
    });
    res.json(brands);
  } catch (error) {
    console.error('Get car brands error:', error);
    res.status(500).json({ error: 'Ошибка получения марок автомобилей' });
  }
});

// Получить модели по марке
router.get('/:brandId/models', async (req, res) => {
  try {
    const models = await prisma.carModel.findMany({
      where: { brandId: parseInt(req.params.brandId) },
      orderBy: { name: 'asc' }
    });
    res.json(models);
  } catch (error) {
    console.error('Get car models error:', error);
    res.status(500).json({ error: 'Ошибка получения моделей' });
  }
});

export default router;