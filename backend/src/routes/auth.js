import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';
import { authenticateToken } from '../middleware/auth.js'; // Добавляем импорт

const router = express.Router();

// Простой GET для проверки работы
router.get('/login', (req, res) => {
  res.json({ 
    message: 'Auth endpoint is working', 
    method: 'Use POST /api/auth/login with {email, password}'
  });
});

// Вход пользователя (POST)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    console.log('Login attempt for:', email);

    // Находим пользователя вместе с локацией
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { location: true }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    if (!user.isActive) {
      console.log('User inactive:', email);
      return res.status(401).json({ error: 'Учетная запись не активна' });
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Создаем JWT токен в любом случае
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

    // Если пользователь - приемосдатчик и у него не выбрана локация
    if (user.role === 'RECEIVER') {
  const locations = await prisma.location.findMany({
    where: { isActive: true }
  });
  
  // Всегда показываем выбор локации, даже если она уже выбрана
  return res.json({
    needsLocation: true,
    userId: user.id,
    locations,
    currentLocationId: user.locationId, // Добавляем текущую локацию
    token
  });
}

    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for:', email);

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
});

// Эндпоинт для выбора локации
router.post('/:userId/location', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { locationId } = req.body;

    console.log('User from token:', req.user);
    console.log('Requested userId:', userId);
    console.log('Requested locationId:', locationId);

    // Проверяем, что пользователь обновляет свою собственную локацию
    if (req.user.id !== parseInt(userId) && req.user.role !== 'ADMIN') {
      console.log('Permission denied: user cannot update this location');
      console.log('User ID from token:', req.user.id, 'Type:', typeof req.user.id);
      console.log('User ID from request:', userId, 'Type:', typeof userId);
      console.log('User role:', req.user.role);
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    // Проверяем, что локация существует
    const location = await prisma.location.findUnique({
      where: { id: parseInt(locationId) }
    });

    if (!location) {
      console.log('Location not found:', locationId);
      return res.status(400).json({ error: 'Локация не найдена' });
    }

    // Обновляем пользователя
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { locationId: parseInt(locationId) },
      include: { location: true }
    });

    // Создаем JWT токен с обновленными данными
 const token = jwt.sign(
  { 
    userId: user.id, 
    email: user.email,
    role: user.role,
    locationId: user.locationId
  },
  process.env.JWT_SECRET || 'fallback-secret',
  { expiresIn: '24h' }
);

console.log('Generated token for user:', user.email);

    const { password: _, ...userWithoutPassword } = user;

    console.log('Location selected successfully for user:', user.id);
    
    res.json({
      message: 'Локация выбрана успешно',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Select location error:', error);
    res.status(500).json({ error: 'Ошибка сервера при выборе локации' });
  }
});

// Получение информации о текущем пользователе
router.get('/me', authenticateToken, async (req, res) => {
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
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
  }
});

export default router;