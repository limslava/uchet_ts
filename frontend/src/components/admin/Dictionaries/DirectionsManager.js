import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { DirectionModal } from './DirectionModal';
import { Button } from '../../common/Button/Button';

export const DirectionsManager = () => {
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadDirections();
  }, [filters, pagination.page]);

  const loadDirections = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDirections({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search
      });
      setDirections(res.data.directions);
      setPagination(res.data.pagination);
    } catch (err) {
      alert('Ошибка загрузки направлений');
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
      key: 'name',
      title: 'Город',
      width: '60%',
      align: 'center'
    },
    {
  key: 'actions',
  title: 'Действия',
  width: '15%',
  align: 'center',
  render: (_, location) => (
    <div className="actions" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
      <Button size="small" variant="outline" onClick={() => handleEdit(location)}>
        Редактировать
      </Button>
      <Button size="small" variant="danger" onClick={() => handleDelete(location)}>
        Удалить
      </Button>
    </div>
  )
}
  ];

  const handleEdit = (direction) => {
    setEditingDirection(direction);
    setModalOpen(true);
  };

  const handleDelete = async (direction) => {
  if (!window.confirm(`Удалить город "${direction.name}"?`)) return;
  
  try {
    await adminApi.deleteDirection(direction.id);
    
    // Локальное удаление вместо полной перезагрузки
    setDirections(prev => prev.filter(d => d.id !== direction.id));
    
    // Обновляем счетчик
    setPagination(prev => ({
      ...prev,
      total: prev.total - 1
    }));
    
    alert('Город удален');
  } catch (err) {
    alert(err.response?.data?.error || 'Ошибка удаления');
    // Только в случае ошибки перезагружаем
    loadDirections();
  }
};

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingDirection) {
        await adminApi.updateDirection(editingDirection.id, data);
        alert('Город обновлен');
      } else {
        await adminApi.createDirection(data);
        alert('Город создан');
      }
      setModalOpen(false);
      setEditingDirection(null);
      loadDirections();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление направлениями (Города)"
        columns={columns}
        data={directions}
        loading={loading}
        pagination={pagination}
        filters={filters}
        onFilterChange={(field, value) => {
          setFilters(prev => ({ ...prev, [field]: value }));
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        onAdd={() => setModalOpen(true)}
      />

      <DirectionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDirection(null);
        }}
        onSubmit={handleSubmit}
        direction={editingDirection}
        loading={modalLoading}
      />
    </>
  );
};