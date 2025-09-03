import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../app.js';

const router = express.Router();

// Получение всех осмотров
router.get('/', authenticateToken, async (req, res) => {
  try {
    const inspections = await prisma.inspection.findMany({
      include: {
        vehicle: {
          include: {
            model: {
              include: {
                brand: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        damages: {
          include: {
            damageType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(inspections);
  } catch (error) {
    console.error('Get inspections error:', error);
    res.status(500).json({ error: 'Ошибка при получении осмотров' });
  }
});

// Создание нового осмотра
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, notes, status, assignedToId } = req.body;
    const createdById = req.user.id;

    const inspection = await prisma.inspection.create({
      data: {
        vehicleId: parseInt(vehicleId),
        notes,
        status: status || 'PENDING',
        createdById,
        assignedToId: assignedToId ? parseInt(assignedToId) : null
      },
      include: {
        vehicle: {
          include: {
            model: {
              include: {
                brand: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(inspection);
  } catch (error) {
    console.error('Create inspection error:', error);
    res.status(500).json({ error: 'Ошибка при создании осмотра' });
  }
});

// Получение осмотра по ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inspection = await prisma.inspection.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehicle: {
          include: {
            model: {
              include: {
                brand: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        damages: {
          include: {
            damageType: true
          }
        }
      }
    });

    if (!inspection) {
      return res.status(404).json({ error: 'Осмотр не найден' });
    }

    res.json(inspection);
  } catch (error) {
    console.error('Get inspection error:', error);
    res.status(500).json({ error: 'Ошибка при получении осмотра' });
  }
});

export default router;