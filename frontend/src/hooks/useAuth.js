import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

// Кэш для хранения данных пользователя и промиса запроса
let authPromise = null;
let cachedUser = JSON.parse(localStorage.getItem('user') || 'null');

export const useAuth = () => {
  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Если пользователь уже в кэше, используем его
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }

      try {
        // Если запрос уже выполняется, используем существующий промис
        if (!authPromise) {
          authPromise = getCurrentUser();
        }
        
        const userData = await authPromise;
        setUser(userData);
        cachedUser = userData; // Сохраняем в кэш
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        authPromise = null; // Сбрасываем промис после завершения
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    cachedUser = userData; // Обновляем кэш
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    cachedUser = null; // Очищаем кэш
  };

  return { user, loading, error, login, logout };
};