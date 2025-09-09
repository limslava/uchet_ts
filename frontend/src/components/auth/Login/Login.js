import React, { useState } from 'react';
import { Button } from '../../common/Button/Button';
import { login, selectLocation } from '../../../services/api';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [userId, setUserId] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      console.log('Полный ответ сервера:', response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // ИСПРАВЛЕНИЕ: правильно проверяем needsLocation
      if (response.needsLocation) {
        setNeedsLocation(true);
        setUserId(response.userId);
        setLocations(response.locations);
      } else {
        const userData = response.user || response;
        localStorage.setItem('user', JSON.stringify(userData));
        
        if (userData.location) {
          localStorage.setItem('selectedLocation', JSON.stringify(userData.location));
        }
        
        // ИСПРАВЛЕНИЕ: правильное перенаправление по роли
        if (userData.role === 'ADMIN') {
          window.location.href = '/admin';
        } else if (userData.role === 'MANAGER') {
          window.location.href = '/admin'; // менеджеры тоже идут в админку
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (e) => {
    e.preventDefault();
    if (!selectedLocationId) {
      setError('Пожалуйста, выберите локацию');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
      return;
    }

    setLoading(true);
    try {
      const response = await selectLocation(userId, selectedLocationId);

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      const user = response.user;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.location) {
        localStorage.setItem('selectedLocation', JSON.stringify(user.location));
      }

      // ИСПРАВЛЕНИЕ: правильное перенаправление после выбора локации
      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else if (user.role === 'MANAGER') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Ошибка при выборе локации');
    } finally {
      setLoading(false);
    }
  };

  if (needsLocation) {
    return (
      <div className="login-container">
        <h2>Выберите вашу локацию</h2>
        <form onSubmit={handleLocationSelect}>
          <div className="form-group">
            <label className="form-label">Локация:</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">-- Выберите локацию --</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error-text">{error}</div>}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="login-button"
          >
            {loading ? 'Сохранение...' : 'Продолжить'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="login-button"
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
};

export default Login;