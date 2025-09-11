import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import { VehicleActsManager } from '../../components/admin/VehicleActs/VehicleActsManager';
import './TransportManagement.css';

export const TransportManagement = () => {
  const { isAdminOrManager } = useAdmin();

  if (!isAdminOrManager) {
    return (
      <AdminLayout>
        <div className="access-denied">
          <h2>Доступ запрещен</h2>
          <p>Требуются права администратора или менеджера для управления перевозками</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="transport-management">
        <div className="transport-header">
          <h1>Управление перевозками</h1>
          <p>Просмотр и управление актами приёма-передачи транспортных средств</p>
        </div>

        <div className="transport-content">
          <VehicleActsManager />
        </div>
      </div>
    </AdminLayout>
  );
};

export default TransportManagement;