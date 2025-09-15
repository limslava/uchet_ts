import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/database.js';

// Простой in-memory кэш для пользователей (можно заменить на Redis в продакшене)
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Токен доступа отсутствует' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      return res.status(401).json({ 
        error: 'Недействительный токен: отсутствует ID пользователя' 
      });
    }

    // Проверяем кэш сначала
    const cachedUser = userCache.get(decoded.userId);
    if (cachedUser && (Date.now() - cachedUser.timestamp) < CACHE_TTL) {
      console.log('Using cached user data for userId:', decoded.userId);
      req.user = cachedUser.data;
      return next();
    }

    // Если нет в кэше или кэш устарел, запрашиваем из БД
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        location: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Пользователь не найден или неактивен' });
    }

    // Сохраняем в кэш
    console.log('Caching user data for userId:', user.id);
    userCache.set(decoded.userId, {
      data: user,
      timestamp: Date.now()
    });

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

// Функция для очистки устаревших записей из кэша (опционально)
setInterval(() => {
  const now = Date.now();
  for (const [userId, cache] of userCache.entries()) {
    if (now - cache.timestamp > CACHE_TTL) {
      userCache.delete(userId);
    }
  }
}, CACHE_TTL);

// Функция для принудительного обновления кэша пользователя (например, при изменении данных)
export const invalidateUserCache = (userId) => {
  userCache.delete(userId);
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