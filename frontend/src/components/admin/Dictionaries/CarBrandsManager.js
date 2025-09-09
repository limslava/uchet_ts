import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../services/adminApi';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { DataTable } from '../../common/DataTable/DataTable';
import { Pagination } from '../../common/Pagination/Pagination';
import { CarModelModal } from './CarModelModal';
import './CarBrandsManager.css';

const BODY_TYPES = [
  'Легковой',
  'Легковой+',
  'Минивэн/Кроссовер',
  'Джип'
];

export const CarBrandsManager = () => {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    brandId: '',
    bodyType: ''
  });

  useEffect(() => {
    loadData();
  }, [filters, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [modelsRes, brandsRes] = await Promise.all([
        adminApi.getCarModels({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          brandId: filters.brandId,
          bodyType: filters.bodyType
        }),
        adminApi.getCarBrands({ limit: 100 })
      ]);

      setModels(modelsRes.data.models);
      setBrands(brandsRes.data.brands);
      setPagination(modelsRes.data.pagination);
    } catch (err) {
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'brand.name',
      title: 'Марка',
      width: '20%',
      render: (_, model) => model.brand?.name || 'Не указана'
    },
    {
      key: 'name',
      title: 'Модель',
      width: '20%'
    },
    {
      key: 'bodyType',
      title: 'Тип кузова',
      width: '20%',
      render: (bodyType) => bodyType || 'Не указан'
    },
    {
      key: 'brandId',
      title: 'BrandID',
      width: '15%',
      render: (_, model) => model.brand?.id || ''
    },
    {
      key: 'actions',
      title: 'Действия',
      width: '25%',
      render: (_, model) => (
        <div className="model-actions">
          <Button
            size="small"
            variant="outline"
            onClick={() => handleEditModel(model)}
          >
            Редактировать
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDeleteModel(model)}
          >
            Удалить
          </Button>
        </div>
      )
    }
  ];

  const handleEditModel = (model) => {
    setEditingModel(model);
    setModalOpen(true);
  };

  const handleDeleteModel = async (model) => {
    if (!window.confirm(`Удалить модель "${model.name}"?`)) return;

    try {
      await adminApi.deleteCarModel(model.id);
      alert('Модель удалена');
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка удаления модели');
    }
  };

  const handleSubmitModel = async (modelData) => {
    try {
      setModalLoading(true);
      
      if (editingModel) {
        await adminApi.updateCarModel(editingModel.id, modelData);
        alert('Модель обновлена');
      } else {
        await adminApi.createCarModel(modelData);
        alert('Модель создана');
      }

      setModalOpen(false);
      setEditingModel(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения модели');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="car-models-manager">
      <div className="models-header">
        <h2>Управление моделями автомобилей</h2>
        <Button onClick={() => setModalOpen(true)}>
          + Добавить модель
        </Button>
      </div>

      <div className="models-filters">
        <Input
          placeholder="Поиск по модели..."
          value={filters.search}
          onChange={(value) => handleFilterChange('search', value)}
          style={{ width: '250px' }}
        />
        
        <select
          value={filters.brandId}
          onChange={(e) => handleFilterChange('brandId', e.target.value)}
          className="filter-select"
        >
          <option value="">Все марки</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={filters.bodyType}
          onChange={(e) => handleFilterChange('bodyType', e.target.value)}
          className="filter-select"
        >
          <option value="">Все типы кузова</option>
          {BODY_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={models}
        loading={loading}
        emptyMessage="Модели не найдены"
      />

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      <CarModelModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingModel(null);
        }}
        onSubmit={handleSubmitModel}
        model={editingModel}
        brands={brands}
        bodyTypes={BODY_TYPES}
        loading={modalLoading}
      />
    </div>
  );
};