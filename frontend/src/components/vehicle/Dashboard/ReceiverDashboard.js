import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import './ReceiverDashboard.css';

export default function ReceiverDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    const locationData = JSON.parse(localStorage.getItem('selectedLocation') || '{}');
    setLocation(locationData);
    
    if (!locationData.name && userData.location) {
      setLocation(userData.location);
      localStorage.setItem('selectedLocation', JSON.stringify(userData.location));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedLocation');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Информационный блок */}
      <div className="info-block">
        <p><strong>Приемосдатчик:</strong> <span className="user-name">{user?.name || 'Не указано'}</span></p>
        <p><strong>Локация:</strong> <span className="location-name">{location?.name || 'Не указана'}</span></p>
      </div>
      
      <h1>Панель приемосдатчика</h1>
      
      <div className="dashboard-buttons">
        <div className="dashboard-button-wrapper">
          <Link to="/receive" className="dashboard-link">
            <Button variant="primary" size="large">
              Создать новый акт приёмки
            </Button>
          </Link>
        </div>
        
        <div className="dashboard-button-wrapper">
          <Link to="/receive-by-scan" className="dashboard-link">
            <Button variant="secondary" size="large">
              Прием по QR-коду
            </Button>
          </Link>
        </div>
        
        <div className="dashboard-button-wrapper">
          <Button 
            onClick={handleLogout}
            variant="danger"
            size="large"
          >
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}