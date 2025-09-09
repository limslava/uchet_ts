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