import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { prisma } from '../app.js';

const router = express.Router();

// Получение всех транспортных средств
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        model: {
          include: {
            brand: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Ошибка при получении транспортных средств' });
  }
});

// Создание нового транспортного средства
router.post('/', authenticateToken, requireRole('RECEIVER'), async (req, res) => {
  try {
    const { vin, licensePlate, modelId, year, color } = req.body;

    // Проверяем существующий VIN
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { vin }
    });

    if (existingVehicle) {
      return res.status(409).json({ 
        error: 'Транспортное средство с таким VIN уже существует',
        existingVehicle 
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vin,
        licensePlate,
        modelId: parseInt(modelId),
        year: year ? parseInt(year) : null,
        color
      },
      include: {
        model: {
          include: {
            brand: true
          }
        }
      }
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Ошибка при создании транспортного средства' });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Vehicles endpoint is working' });
});

// Поиск транспортного средства по VIN
router.get('/vin/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    console.log('Searching for VIN:', vin);

    const vehicle = await prisma.vehicle.findUnique({
      where: { vin },
      include: {
        model: {
          include: {
            brand: true
          }
        }
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Транспортное средство не найдено' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Find vehicle by VIN error:', error);
    res.status(500).json({ error: 'Ошибка при поиске транспортного средства' });
  }
});

export default router;