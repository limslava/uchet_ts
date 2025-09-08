import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Authorization header:', authHeader);
  console.log('Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  try {
    // Проверяем базовый фортокен token
    if (token.split('.').length !== 3) {
      throw new Error('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    console.log('Decoded token:', decoded);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { location: true }
    });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Пользователь не найден или не активен' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Недействительный токен' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Срок действия токена истек' });
    } else {
      return res.status(403).json({ error: 'Ошибка аутентификации' });
    }
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }
    next();
  };
};