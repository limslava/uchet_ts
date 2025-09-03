import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Пользователь не найден или не активен' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Недействительный токен' });
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