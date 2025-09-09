import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../services/adminApi';
import { GenericDictionaryManager } from './GenericDictionaryManager';
import { TransportMethodModal } from './TransportMethodModal';
import { Button } from '../../common/Button/Button';

export const TransportMethodsManager = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    loadMethods();
  }, [filters, pagination.page]);

  const loadMethods = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getTransportMethods({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search
      });
      setMethods(res.data.methods);
      setPagination(res.data.pagination);
    } catch (err) {
      alert('Ошибка загрузки способов перевозки');
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
      title: 'Способ перевозки',
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

  const handleEdit = (method) => {
    setEditingMethod(method);
    setModalOpen(true);
  };

  const handleDelete = async (method) => {
    if (!window.confirm(`Удалить способ перевозки "${method.name}"?`)) return;
    try {
      await adminApi.deleteTransportMethod(method.id);
      alert('Способ перевозки удален');
      loadMethods();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    }
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      if (editingMethod) {
        await adminApi.updateTransportMethod(editingMethod.id, data);
        alert('Способ перевозки обновлен');
      } else {
        await adminApi.createTransportMethod(data);
        alert('Способ перевозки создан');
      }
      setModalOpen(false);
      setEditingMethod(null);
      loadMethods();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <GenericDictionaryManager
        title="Управление способами перевозки"
        columns={columns}
        data={methods}
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

      <TransportMethodModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMethod(null);
        }}
        onSubmit={handleSubmit}
        method={editingMethod}
        loading={modalLoading}
      />
    </>
  );
};