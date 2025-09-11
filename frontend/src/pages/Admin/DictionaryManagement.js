import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import { CarBrandsManager } from '../../components/admin/Dictionaries/CarBrandsManager';
import { DirectionsManager } from '../../components/admin/Dictionaries/DirectionsManager';
import { TransportMethodsManager } from '../../components/admin/Dictionaries/TransportMethodsManager';
import { LocationsManager } from '../../components/admin/Dictionaries/LocationsManager';
import { VehicleActsManager } from '../../components/admin/VehicleActs/VehicleActsManager';
import './DictionaryManagement.css';

export const DictionaryManagement = () => {
  const { canManageDictionaries } = useAdmin();
  const [activeTab, setActiveTab] = useState('car-brands');

  const tabs = [
    { id: 'car-brands', label: 'Марки и модели', icon: '🚗' },
    { id: 'directions', label: 'Направления', icon: '🧭' },
    { id: 'transport-methods', label: 'Способы перевозки', icon: '🚚' },
    { id: 'locations', label: 'Локации', icon: '🏢' },
    { id: 'vehicle-acts', label: 'Акты приёмки', icon: '📋' }
  ];

  if (!canManageDictionaries) {
    return (
      <AdminLayout>
        <div className="access-denied">
          <h2>Доступ запрещен</h2>
          <p>Требуются права администратора или менеджера для управления справочниками</p>
        </div>
      </AdminLayout>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'car-brands':
        return <CarBrandsManager />;
      case 'directions':
        return <DirectionsManager />;
      case 'transport-methods':
        return <TransportMethodsManager />;
      case 'locations':
        return <LocationsManager />;
      case 'vehicle-acts':
        return <VehicleActsManager />;
      default:
        return <CarBrandsManager />;
    }
  };

  return (
    <AdminLayout>
      <div className="dictionary-management">
        <div className="dictionary-header">
          <h1>Управление справочниками</h1>
          <p>Редактирование системных справочников и данных</p>
        </div>

        <div className="dictionary-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="dictionary-content">
          {renderContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DictionaryManagement;