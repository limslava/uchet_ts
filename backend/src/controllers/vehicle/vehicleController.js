import { prisma } from '../../utils/database.js';

export class AnalyticsAdminController {
  async getDashboardStats(req, res) {
    try {
      const [
        totalActs,
        totalUsers,
        totalVehicles,
        todayActs,
        activeUsersCount
      ] = await Promise.all([
        prisma.vehicleAct.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.vehicle.count(),
        prisma.vehicleAct.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.user.count({
          where: { 
            isActive: true,
            lastActivity: {
              gte: new Date(Date.now() - 30 * 60 * 1000)
            }
          }
        })
      ]);

      res.json({
        totalActs,
        totalUsers,
        totalVehicles,
        todayActs,
        activeUsersCount
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Ошибка при получении статистики' });
    }
  }
}

export const analyticsAdminController = new AnalyticsAdminController();
import { logger } from '../../utils/logger.js';



export const vehicleController = {
  // Получение всех транспортных средств
  async getAllVehicles(req, res) {
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
      logger.error('Get vehicles error:', error);
      res.status(500).json({ error: 'Ошибка при получении транспортных средств' });
    }
  },

  // Создание нового транспортного средства
  async createVehicle(req, res) {
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
      logger.error('Create vehicle error:', error);
      res.status(500).json({ error: 'Ошибка при создании транспортного средства' });
    }
  },

  // Поиск по VIN
  async getVehicleByVin(req, res) {
    try {
      const { vin } = req.params;
      logger.info('Searching for VIN:', vin);

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
      logger.error('Find vehicle by VIN error:', error);
      res.status(500).json({ error: 'Ошибка при поиске транспортного средства' });
    }
  }
};