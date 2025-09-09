import { prisma } from '../../utils/database.js';
import bcrypt from 'bcryptjs';

export class UserAdminController {
  
  // Получить всех пользователей с пагинацией
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, search, role, isActive } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (role) {
        where.role = role;
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            location: true,
            _count: {
              select: {
                vehicleActs: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.user.count({ where })
      ]);
      
      res.json({
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }
  
  // Создать пользователя
  async createUser(req, res) {
    try {
      const { email, password, name, role, locationId, isActive = true } = req.body;
      
      // Проверка существующего пользователя
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (password && password.length < 6) {
  return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
}

      if (existingUser) {
        return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
      }
      
      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          isActive,
          locationId: locationId ? parseInt(locationId) : null
        },
        include: {
          location: true
        }
      });
      
      // Убираем пароль из ответа
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
  }
  
  // Обновить пользователя
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, name, role, locationId, isActive } = req.body;
      
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          email,
          name,
          role,
          isActive,
          locationId: locationId ? parseInt(locationId) : null
        },
        include: {
          location: true
        }
      });
      
      // Убираем пароль из ответа
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
  }
  
  // Удалить пользователя
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Нельзя удалить самого себя
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'Нельзя удалить собственный аккаунт' });
      }
      
      await prisma.user.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Пользователь удален' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
  }
  
  // Сбросить пароль пользователя
  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { password: hashedPassword }
      });
      
      res.json({ message: 'Пароль успешно сброшен' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Ошибка при сбросе пароля' });
    }
  }
}

export const userAdminController = new UserAdminController();