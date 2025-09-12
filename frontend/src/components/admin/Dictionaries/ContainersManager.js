import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { ContainerModal } from './ContainerModal';
import { Button } from '../../common/Button/Button';

export const ContainersManager = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ 
    search: '',
    isActive: '',
    ownership: ''
  });

  useEffect(() => {
    loadContainers();
  }, [filters, pagination.page]);

 const loadContainers = async () => {
  try {
    setLoading(true);
    const res = await adminApi.getContainers({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      isActive: filters.isActive,
      ownership: filters.ownership
    });
    
    if (res.data && res.data.containers && res.data.pagination) {
      setContainers(res.data.containers);
      setPagination(res.data.pagination);
    } else {
      setContainers([]);
      setPagination({ page: 1, limit: 20, total: 0, pages: 1 });
    }
  } catch (err) {
    if (err.response?.status === 401) {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      alert('Ошибка загрузки контейнеров');
    }
    setContainers([]);
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
      key: 'number',
      title: 'Номер контейнера',
      width: '25%',
      align: 'center'
    },
    {
      key: 'type',
      title: 'Тип контейнера',
      width: '25%',
      align: 'center'
    },
    {
      key: 'ownership',
      title: 'Принадлежность',
      width: '20%',
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
      render: (_, container) => (
        <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button size="small" variant="outline" onClick={() => handleEdit(container)}>
            Редактировать
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(container)}>
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
  const handleEdit = (container) => {
    setEditingContainer(container);
    setModalOpen(true);
  };

  const handleDelete = async (container) => {
    if (!window.confirm(`Удалить контейнер "${container.number}"?`)) return;
    
    try {
      await adminApi.deleteContainer(container.id);
      alert('Контейнер удален');
      loadContainers();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления контейнера');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingContainer) {
        await adminApi.updateContainer(editingContainer.id, data);
        alert('Контейнер обновлен');
      } else {
        await adminApi.createContainer(data);
        alert('Контейнер создан');
      }
      setModalOpen(false);
      setEditingContainer(null);
      loadContainers();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения контейнера');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление контейнерами"
        columns={columns}
        data={containers}
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
              value={filters.ownership}
              onChange={(e) => setFilters(prev => ({ ...prev, ownership: e.target.value }))}
              className="filter-select"
            >
              <option value="">Все принадлежности</option>
              <option value="Собственные">Собственные</option>
              <option value="Аренда">Аренда</option>
              <option value="Лизинг">Лизинг</option>
            </select>
          </>
        }
      />

      <ContainerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingContainer(null);
        }}
        onSubmit={handleSubmit}
        container={editingContainer}
        loading={modalLoading}
      />
    </>
  );
};