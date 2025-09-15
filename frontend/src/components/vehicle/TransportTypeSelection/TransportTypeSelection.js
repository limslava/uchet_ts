import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TransportTypeSelection.css';

const TransportTypeSelection = () => {
  const navigate = useNavigate();

  const transportTypes = [
    { id: 'autocarrier', name: 'Автовоз', icon: '🚛' },
    { id: 'container', name: 'Контейнер', icon: '📦' },
    { id: 'net', name: 'Сетка', icon: '🔲' },
    { id: 'truck', name: 'Фура', icon: '🚚' }
  ];

const handleTransportSelect = (transportType) => {
  if (transportType === 'container') {
    navigate('/container-shipping');
  } else if (transportType === 'net') {
    navigate('/grid-loading');
  } else if (transportType === 'truck') {
    navigate('/curtain-truck-loading');
  } else if (transportType === 'autocarrier') {
    navigate('/autocarrier-loading'); // ДОБАВЛЕНО: переход на погрузку на автовоз
  } else {
    alert(`Тип отгрузки "${transportType}" в разработке`);
  }
};
  return (
    <div className="transport-type-selection">
      <h2>Выберите тип отгрузки</h2>
      <div className="transport-grid">
        {transportTypes.map(type => (
          <button
            key={type.id}
            className="transport-btn"
            onClick={() => handleTransportSelect(type.id)}
          >
            <span className="transport-icon">{type.icon}</span>
            <span className="transport-name">{type.name}</span>
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Назад
        </button>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Назад в главное меню
        </button>
      </div>
    </div>
  );
};

export default TransportTypeSelection;