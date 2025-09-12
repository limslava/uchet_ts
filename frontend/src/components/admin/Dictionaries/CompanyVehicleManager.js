import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { CompanyVehicleModal } from './CompanyVehicleModal';
import { Button } from '../../common/Button/Button';

export const CompanyVehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ 
    search: '',
    isActive: '',
    park: ''
  });

  useEffect(() => {
    loadVehicles();
  }, [filters, pagination.page]);

const loadVehicles = async () => {
  try {
    setLoading(true);
    const res = await adminApi.getCompanyVehicles({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      park: filters.park
    });
    
    if (res.data && res.data.vehicles && res.data.pagination) {
      setVehicles(res.data.vehicles);
      setPagination(res.data.pagination);
    } else {
      setVehicles([]);
      setPagination({ page: 1, limit: 20, total: 0, pages: 1 });
    }
  } catch (err) {
    if (err.response?.status === 401) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      alert('Ошибка загрузки ТС перевозчиков');
    }
    setVehicles([]);
  } finally {
    setLoading(false);
  }
};

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '10%',
      align: 'center'
    },
    {
      key: 'brand',
      title: 'Марка',
      width: '20%',
      align: 'center'
    },
    {
      key: 'model',
      title: 'Модель',
      width: '20%',
      align: 'center'
    },
    {
      key: 'licensePlate',
      title: 'Гос. номер',
      width: '20%',
      align: 'center'
    },
    {
      key: 'park',
      title: 'Парк',
      width: '15%',
      align: 'center'
    },
    {
      key: 'isActive',
      title: 'Статус',
      width: '10%',
      align: 'center',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Активен' : 'Неактивен'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Действия',
      width: '15%',
      align: 'center',
      render: (_, vehicle) => (
        <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button size="small" variant="outline" onClick={() => handleEdit(vehicle)}>
            Редактировать
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(vehicle)}>
            Удалить
          </Button>
        </div>
      )
    }
  ];

const [error, setError] = useState(null);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null); // Сбрасываем ошибку перед загрузкой
    // ... ваш код загрузки данных
  } catch (err) {
    setError('Ошибка загрузки данных');
    console.error('Ошибка загрузки:', err);
  } finally {
    setLoading(false);
  }
};

// В рендере компонента добавьте:
{error && (
  <div className="error-message">
    {error}
    <button onClick={loadData}>Попробовать снова</button>
  </div>
)}

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Удалить ТС "${vehicle.brand} ${vehicle.model}"?`)) return;
    
    try {
      await adminApi.deleteCompanyVehicle(vehicle.id);
      alert('ТС перевозчика удалено');
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления ТС');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingVehicle) {
        await adminApi.updateCompanyVehicle(editingVehicle.id, data);
        alert('ТС перевозчика обновлено');
      } else {
        await adminApi.createCompanyVehicle(data);
        alert('ТС перевозчика создано');
      }
      setModalOpen(false);
      setEditingVehicle(null);
      loadVehicles();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения ТС');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление ТС перевозчиков"
        columns={columns}
        data={vehicles}
        loading={loading}
        pagination={pagination}
        filters={filters}
        onFilterChange={(field, value) => {
          setFilters(prev => ({ ...prev, [field]: value }));
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        onAdd={() => setModalOpen(true)}
        additionalFilters={
          <>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
              className="filter-select"
            >
              <option value="">Все статусы</option>
              <option value="true">Активные</option>
              <option value="false">Неактивные</option>
            </select>
            <select
              value={filters.park}
              onChange={(e) => setFilters(prev => ({ ...prev, park: e.target.value }))}
              className="filter-select"
            >
              <option value="">Все парки</option>
              <option value="Собственный">Собственный</option>
              <option value="Привлеченный">Привлеченный</option>
            </select>
          </>
        }
      />

      <CompanyVehicleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleSubmit}
        vehicle={editingVehicle}
        loading={modalLoading}
      />
    </>
  );
};