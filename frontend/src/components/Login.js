import React, { useState } from 'react';
import { login, selectLocation } from '../services/api';

const Login = () => {
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
    
    // Всегда сохраняем токен, если он есть в ответе
    if (response.token) {
      localStorage.setItem('token', response.token);
      console.log('Token saved:', response.token);
    }
    
    if (response.needsLocation) {
      setNeedsLocation(true);
      setUserId(response.userId);
      setLocations(response.locations);
    } else {
      localStorage.setItem('user', JSON.stringify(response.user));
      window.location.href = '/';
    }
  } catch (err) {
    setError('Неверный email или пароль');
    console.error('Login error:', err);
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

  // Проверяем наличие токена
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
    return;
  }

  setLoading(true);
  try {
    console.log('Selecting location for user:', userId, 'location:', selectedLocationId);
    const response = await selectLocation(userId, selectedLocationId);
    
    // Обновляем токен, если он вернулся в ответе
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('Location selected successfully, redirecting...');
    window.location.href = '/';
  } catch (err) {
    console.error('Error selecting location:', err);
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
          <div>
            <label>Локация:</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              required
            >
              <option value="">-- Выберите локацию --</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Продолжить'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default Login;