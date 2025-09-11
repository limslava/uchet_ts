import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from '../Dictionaries/GenericDictionaryManager';
import { Button } from '../../common/Button/Button';
import { VehicleActModal } from './VehicleActModal';
import { Input } from '../../common/Input/Input';
import './VehicleActsManager.css';

export const VehicleActsManager = () => {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ 
    page: 1, 
    limit: 20, 
    total: 0, 
    pages: 1 
  });
  const [filters, setFilters] = useState({ 
    search: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    loadActs();
  }, [filters, pagination.page]);

  const loadActs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Очищаем пустые фильтры
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await adminApi.getVehicleActs(params);
      setActs(response.data.acts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading acts:', error);
      alert('Ошибка при загрузке актов');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAct = async (act) => {
    try {
      const response = await adminApi.printVehicleAct(act.id);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(response.data);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      alert('Ошибка при печати акта');
    }
  };

  const handlePrintContract = async (act) => {
    try {
      const response = await adminApi.printContract(act.id);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(response.data);
      printWindow.document.close();
    } catch (error) {
      console.error('Print contract error:', error);
      alert('Ошибка при печати договора');
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      NEW: 'Новый',
      RECEIVED: 'Принят',
      COMPLETED: 'Завершен',
      CANCELLED: 'Отменен'
    };
    return statuses[status] || status;
  };

  const handleEdit = (act) => {
    setEditingAct(act);
    setModalOpen(true);
  };

  const handleDelete = async (act) => {
    if (!window.confirm(`Удалить акт "${act.contractNumber}"?`)) return;
    
    try {
      await adminApi.deleteVehicleAct(act.id);
      alert('Акт удален');
      loadActs();
    } catch (error) {
      console.error('Error deleting act:', error);
      alert(error.response?.data?.error || 'Ошибка при удалении акта');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      await adminApi.updateVehicleAct(editingAct.id, data);
      alert('Акт обновлен');
      setModalOpen(false);
      setEditingAct(null);
      loadActs();
    } catch (error) {
      console.error('Error updating act:', error);
      alert(error.response?.data?.error || 'Ошибка при обновлении акта');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const columns = [
    {
      key: 'contractNumber',
      title: 'Номер договора',
      width: '12%',
      align: 'center'
    },
    {
      key: 'vin',
      title: 'VIN',
      width: '15%',
      align: 'center'
    },
    {
      key: 'licensePlate',
      title: 'Гос. номер',
      width: '10%',
      align: 'center',
      render: (plate) => plate || '—'
    },
    {
      key: 'carBrand.name',
      title: 'Марка',
      width: '12%',
      align: 'center',
      render: (_, act) => act.carBrand?.name || '—'
    },
    {
      key: 'carModel.name',
      title: 'Модель',
      width: '12%',
      align: 'center',
      render: (_, act) => act.carModel?.name || '—'
    },
    {
      key: 'status',
      title: 'Статус',
      width: '10%',
      align: 'center',
      render: (status) => (
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {getStatusLabel(status)}
        </span>
      )
    },
    {
      key: 'Location.name',
      title: 'Локация',
      width: '12%',
      align: 'center',
      render: (_, act) => act.Location?.name || '—'
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
      width: '12%',
      align: 'center',
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      key: 'actions',
      title: 'Действия',
      width: '10%',
      align: 'center',
      render: (_, act) => (
        <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button 
            size="small" 
            variant="outline" 
            onClick={() => handleEdit(act)}
          >
            Просмотр
          </Button>
          <Button 
            size="small" 
            variant="danger" 
            onClick={() => handleDelete(act)}
          >
            Удалить
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="vehicle-acts-header">
        <h2>Управление актами приёмки</h2>
        <div className="search-container">
          <Input
            placeholder="Поиск..."
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <GenericDictionaryManager
        title="Акты приёмки"
        columns={columns}
        data={acts}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        showSearch={false}
        additionalFilters={
          <div className="vehicle-acts-filters">
            <div className="filter-group">
              <label>Статус</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">Все статусы</option>
                <option value="NEW">Новый</option>
                <option value="RECEIVED">Принят</option>
                <option value="COMPLETED">Завершен</option>
                <option value="CANCELLED">Отменен</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>От даты</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="filter-select"
              />
            </div>
            
            <div className="filter-group">
              <label>До даты</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="filter-select"
              />
            </div>
          </div>
        }
      />

      <VehicleActModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAct(null);
        }}
        onSubmit={handleSubmit}
        act={editingAct}
        loading={modalLoading}
        onPrintAct={handlePrintAct}
        onPrintContract={handlePrintContract}
      />
    </>
  );
};