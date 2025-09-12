import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { DriverModal } from './DriverModal';
import { Button } from '../../common/Button/Button';

export const DriversManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', isActive: '' });

  useEffect(() => {
    loadDrivers();
  }, [filters, pagination.page]);

const loadDrivers = async () => {
  try {
    setLoading(true);
    const res = await adminApi.getDrivers({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive
    });
    
    // Добавьте проверку на существование данных
    if (res.data && res.data.drivers && res.data.pagination) {
      setDrivers(res.data.drivers);
      setPagination(res.data.pagination);
    } else {
      setDrivers([]);
      setPagination({ page: 1, limit: 20, total: 0, pages: 1 });
    }
  } catch (err) {
    alert('Ошибка загрузки водителей');
    setDrivers([]);
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
      key: 'fullName',
      title: 'ФИО',
      width: '40%',
      align: 'center'
    },
    {
      key: 'phone',
      title: 'Телефон',
      width: '30%',
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
      width: '10%',
      align: 'center',
      render: (_, driver) => (
        <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button size="small" variant="outline" onClick={() => handleEdit(driver)}>
            Редактировать
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(driver)}>
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
  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setModalOpen(true);
  };

  const handleDelete = async (driver) => {
    if (!window.confirm(`Удалить водителя "${driver.fullName}"?`)) return;
    
    try {
      await adminApi.deleteDriver(driver.id);
      alert('Водитель удален');
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления водителя');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingDriver) {
        await adminApi.updateDriver(editingDriver.id, data);
        alert('Водитель обновлен');
      } else {
        await adminApi.createDriver(data);
        alert('Водитель создан');
      }
      setModalOpen(false);
      setEditingDriver(null);
      loadDrivers();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения водителя');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление водителями"
        columns={columns}
        data={drivers}
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
          <select
            value={filters.isActive}
            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
            className="filter-select"
          >
            <option value="">Все статусы</option>
            <option value="true">Активные</option>
            <option value="false">Неактивные</option>
          </select>
        }
      />

      <DriverModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDriver(null);
        }}
        onSubmit={handleSubmit}
        driver={editingDriver}
        loading={modalLoading}
      />
    </>
  );
};