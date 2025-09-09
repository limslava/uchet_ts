import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { LocationModal } from './LocationModal';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';

export const LocationsManager = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ 
    search: ''
  });

  useEffect(() => {
    loadData();
  }, [filters, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const locationsRes = await adminApi.getLocations({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search
      });
      
      setLocations(locationsRes.data.locations);
      setPagination(locationsRes.data.pagination);
    } catch (err) {
      alert('Ошибка загрузки данных');
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
      title: 'Локация',
      width: '25%',
      align: 'center'
    },
    {
      key: 'address',
      title: 'Адрес',
      width: '30%',
      align: 'center'
    },
    {
      key: 'city',
      title: 'Город',
      width: '20%',
      align: 'center',
      render: (city) => city || 'Не указан'
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

  const handleEdit = (location) => {
    setEditingLocation(location);
    setModalOpen(true);
  };

  const handleDelete = async (location) => {
    if (!window.confirm(`Удалить локацию "${location.name}"?`)) return;
    try {
      await adminApi.deleteLocation(location.id);
      alert('Локация удалена');
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingLocation) {
        await adminApi.updateLocation(editingLocation.id, data);
        alert('Локация обновлена');
      } else {
        await adminApi.createLocation(data);
        alert('Локация создана');
      }
      setModalOpen(false);
      setEditingLocation(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление локациями"
        columns={columns}
        data={locations}
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

      <LocationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLocation(null);
        }}
        onSubmit={handleSubmit}
        location={editingLocation}
        loading={modalLoading}
      />
    </>
  );
};