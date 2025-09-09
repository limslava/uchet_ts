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

export const dictionaryController = {
  // Получение всех направлений
  async getDirections(req, res) {
    try {
      const directions = await prisma.direction.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      res.json(directions);
    } catch (error) {
      logger.error('Get directions error:', error);
      res.status(500).json({ error: 'Ошибка получения направлений' });
    }
  },

  // Получение всех способов перевозки
  async getTransportMethods(req, res) {
    try {
      const methods = await prisma.transportMethod.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      });
      res.json(methods);
    } catch (error) {
      logger.error('Get transport methods error:', error);
      res.status(500).json({ error: 'Ошибка получения способов перевозки' });
    }
  },

  // Получение всех марок автомобилей
  async getCarBrands(req, res) {
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
      logger.error('Get car brands error:', error);
      res.status(500).json({ error: 'Ошибка получения марок автомобилей' });
    }
  },

  // Получение моделей по марке
  async getCarModelsByBrand(req, res) {
  try {
    const { bodyType } = req.query; // ДОБАВЛЕНО: опциональный параметр фильтрации
    
    const whereClause = { 
      brandId: parseInt(req.params.brandId) 
    };
    
    // ДОБАВЛЕНО: фильтрация по типу кузова, если указана
    if (bodyType) {
      whereClause.bodyType = bodyType;
    }
    
    const models = await prisma.carModel.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    });
    
    res.json(models);
  } catch (error) {
    logger.error('Get car models error:', error);
    res.status(500).json({ error: 'Ошибка получения моделей' });
  }
}
};