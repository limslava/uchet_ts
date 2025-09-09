import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { adminApi } from '../../../services/adminApi';
import './CarModelModal.css';

export const CarModelModal = ({
  isOpen,
  onClose,
  onSubmit,
  model = null,
  brands = [],
  bodyTypes = [],
  onSuccess,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    bodyType: ''
  });
  const [newBrandName, setNewBrandName] = useState('');
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name || '',
        brandId: model.brandId?.toString() || '',
        bodyType: model.bodyType || ''
      });
      setShowNewBrand(false);
    } else {
      setFormData({
        name: '',
        brandId: '',
        bodyType: ''
      });
      setNewBrandName('');
      setShowNewBrand(false);
    }
    setErrors({});
    setModalLoading(false);
    setCurrentStep('');
  }, [model, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название модели обязательно';
    }

    if (!formData.brandId && !newBrandName.trim()) {
      newErrors.brand = 'Выберите марку или создайте новую';
    }

    if (newBrandName.trim() && !formData.brandId) {
      if (newBrandName.trim().length < 2) {
        newErrors.newBrand = 'Название марки должно быть не менее 2 символов';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = { ...formData };
    setModalLoading(true);
    
    // Создание новой марки, если нужно
    if (newBrandName.trim() && !formData.brandId) {
      setCurrentStep('Создание марки...');
      try {
        const brandRes = await adminApi.createCarBrand({ name: newBrandName.trim() });
        submitData.brandId = brandRes.data.id.toString();
        setCurrentStep('Создание модели...');
      } catch (err) {
        alert(err.response?.data?.error || 'Ошибка создания марки');
        setModalLoading(false);
        setCurrentStep('');
        return;
      }
    }

    // Создание или обновление модели
    try {
      setCurrentStep('Сохранение модели...');
      if (model) {
        await adminApi.updateCarModel(model.id, submitData);
        alert('Модель обновлена');
      } else {
        await adminApi.createCarModel(submitData);
        alert('Модель создана');
      }
      
      onClose(); // ИСПРАВЛЕНО: заменили setModalOpen(false) на onClose()
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Ошибка сохранения модели');
    } finally {
      setModalLoading(false);
      setCurrentStep('');
    }
  };

  const handleClose = () => {
    if (!modalLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={model ? 'Редактировать модель' : 'Создать модель'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="car-model-form">
        <div className="form-group">
          <label>Модель *</label>
          <Input
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            error={errors.name}
            placeholder="Введите название модели"
            disabled={modalLoading}
          />
        </div>

        <div className="form-group">
          <label>Марка *</label>
          {!showNewBrand ? (
            <>
              <select
                value={formData.brandId}
                onChange={(e) => handleChange('brandId', e.target.value)}
                className="form-select"
                disabled={modalLoading}
              >
                <option value="">-- Выберите марку --</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => setShowNewBrand(true)}
                disabled={modalLoading}
              >
                + Создать новую марку
              </Button>
              {errors.brand && <span className="error-text">{errors.brand}</span>}
            </>
          ) : (
            <>
              <Input
                value={newBrandName}
                onChange={setNewBrandName}
                error={errors.newBrand}
                placeholder="Введите название новой марки"
                disabled={modalLoading}
              />
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => {
                  setShowNewBrand(false);
                  setNewBrandName('');
                }}
                disabled={modalLoading}
              >
                ← Выбрать существующую марку
              </Button>
            </>
          )}
        </div>

        <div className="form-group">
          <label>Тип кузова</label>
          <select
            value={formData.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            className="form-select"
            disabled={modalLoading}
          >
            <option value="">-- Выберите тип кузова --</option>
            {bodyTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {currentStep && (
          <div className="progress-text">
            {currentStep}
          </div>
        )}

        <div className="modal-actions">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={modalLoading}
          >
            Отмена
          </Button>
          <Button 
            type="submit" 
            loading={modalLoading ? true : undefined}
            disabled={modalLoading}
          >
            {model ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};