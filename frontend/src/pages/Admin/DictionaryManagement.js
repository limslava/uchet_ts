import React, { useState } from 'react';
import { CarBrandsManager } from '../../components/admin/Dictionaries/CarBrandsManager';
import { DirectionsManager } from '../../components/admin/Dictionaries/DirectionsManager';
import { TransportMethodsManager } from '../../components/admin/Dictionaries/TransportMethodsManager';
import { LocationsManager } from '../../components/admin/Dictionaries/LocationsManager';
import { DriversManager } from '../../components/admin/Dictionaries/DriversManager';
import { CompanyVehicleManager } from '../../components/admin/Dictionaries/CompanyVehicleManager';
import { ContainersManager } from '../../components/admin/Dictionaries/ContainersManager';
import './DictionaryManagement.css';

const TABS = {
  CAR_BRANDS: 'carBrands',
  DIRECTIONS: 'directions',
  TRANSPORT_METHODS: 'transportMethods',
  LOCATIONS: 'locations',
  DRIVERS: 'drivers',
  COMPANY_VEHICLE: 'companyVehicle',
  CONTAINERS: 'containers'
};

export const DictionaryManagement = () => {
  const [activeTab, setActiveTab] = useState(TABS.CAR_BRANDS);

  const renderTab = () => {
    switch (activeTab) {
      case TABS.CAR_BRANDS:
        return <CarBrandsManager />;
      case TABS.DIRECTIONS:
        return <DirectionsManager />;
      case TABS.TRANSPORT_METHODS:
        return <TransportMethodsManager />;
      case TABS.LOCATIONS:
        return <LocationsManager />;
      case TABS.DRIVERS:
        return <DriversManager />;
      case TABS.COMPANY_VEHICLE:
        return <CompanyVehicleManager />;
      case TABS.CONTAINERS:
        return <ContainersManager />;
      default:
        return <CarBrandsManager />;
    }
  };

  return (
    <div className="dictionary-management">
      <div className="tabs">
        <button
          className={activeTab === TABS.CAR_BRANDS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.CAR_BRANDS)}
        >
          Марки и модели
        </button>
        <button
          className={activeTab === TABS.DIRECTIONS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.DIRECTIONS)}
        >
          Направления
        </button>
        <button
          className={activeTab === TABS.TRANSPORT_METHODS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.TRANSPORT_METHODS)}
        >
          Способы перевозки
        </button>
        <button
          className={activeTab === TABS.LOCATIONS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.LOCATIONS)}
        >
          Локации
        </button>
        <button
          className={activeTab === TABS.DRIVERS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.DRIVERS)}
        >
          Водители
        </button>
        <button
          className={activeTab === TABS.COMPANY_VEHICLE ? 'active' : ''}
          onClick={() => setActiveTab(TABS.COMPANY_VEHICLE)}
        >
          ТС перевозчиков
        </button>
        <button
          className={activeTab === TABS.CONTAINERS ? 'active' : ''}
          onClick={() => setActiveTab(TABS.CONTAINERS)}
        >
          Контейнеры
        </button>
      </div>

      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default DictionaryManagement;