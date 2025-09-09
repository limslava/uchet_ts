import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

export const authController = {
  async getLoginInfo(req, res) {
    res.json({ 
      message: 'Auth endpoint is working', 
      method: 'Use POST /api/auth/login with {email, password}'
    });
  },

  async login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    logger.info('Login attempt for:', email);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { location: true }
    });

    if (!user) {
      logger.warn('User not found:', email);
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    if (!user.isActive) {
      logger.warn('User inactive:', email);
      return res.status(401).json({ error: 'Учетная запись не активна' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Invalid password for:', email);
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        locationId: user.locationId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    // Для приемосдатчика проверяем наличие локации
    if (user.role === 'RECEIVER') {
  const locations = await prisma.location.findMany({
    where: { isActive: true }
  });

  const { password: _, ...userWithoutPassword } = user;

  return res.json({
    needsLocation: true,
    userId: user.id,
    locations,
    currentLocationId: user.locationId, // ← можно показать, какую выбрал раньше
    token,
    user: userWithoutPassword
  });
}

    // Для всех остальных ролей (ADMIN, MANAGER)
    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
},

  async selectLocation(req, res) {
  try {
    const { userId } = req.params;
    const { locationId } = req.body;

    // ДОБАВЬТЕ ПРОВЕРКУ ДОСТУПА
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    const location = await prisma.location.findUnique({
      where: { id: parseInt(locationId) }
    });

    if (!location) {
      return res.status(400).json({ error: 'Локация не найдена' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { locationId: parseInt(locationId) },
      include: { location: true }
    });

    // ОБНОВЛЕННЫЙ ТОКЕН С НОВОЙ ЛОКАЦИЕЙ
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        locationId: user.locationId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Локация выбрана успешно',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Select location error:', error);
    res.status(500).json({ error: 'Ошибка сервера при выборе локации' });
  }
},

  async getCurrentUser(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { location: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);

    } catch (error) {
      logger.error('Auth me error:', error);
      res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
  }
};