// authMiddleware.js - исправленная версия
import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Токен доступа отсутствует' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Проверяем наличие userId в decoded токене
    if (!decoded.userId) {
      return res.status(401).json({ 
        error: 'Недействительный токен: отсутствует ID пользователя' 
      });
    }

    // Проверяем существование пользователя в БД
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        location: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Пользователь не найден или неактивен' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Токен истек' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Ошибка аутентификации' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Недостаточно прав доступа' 
      });
    }
    next();
  };
};