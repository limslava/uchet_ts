import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';

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

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
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

    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

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

// Получение информации о текущем пользователе
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Токен отсутствует' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
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