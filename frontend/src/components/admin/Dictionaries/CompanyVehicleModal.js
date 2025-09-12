import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const CompanyVehicleModal = ({ isOpen, onClose, onSubmit, vehicle, loading }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    park: 'Собственный'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        licensePlate: vehicle.licensePlate || '',
        park: vehicle.park || 'Собственный'
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        licensePlate: '',
        park: 'Собственный'
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'Марка обязательна';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Модель обязательна';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Гос. номер обязателен';
    }

    if (!formData.park) {
      newErrors.park = 'Парк обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? 'Редактировать ТС перевозчика' : 'Создать ТС перевозчика'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="company-vehicle-form">
        <Input
          label="Марка *"
          value={formData.brand}
          onChange={(value) => handleChange('brand', value)}
          error={errors.brand}
          placeholder="Введите марку ТС"
        />

        <Input
          label="Модель *"
          value={formData.model}
          onChange={(value) => handleChange('model', value)}
          error={errors.model}
          placeholder="Введите модель ТС"
        />

        <Input
          label="Гос. номер *"
          value={formData.licensePlate}
          onChange={(value) => handleChange('licensePlate', value)}
          error={errors.licensePlate}
          placeholder="Введите гос. номер"
        />

        <div className="form-group">
          <label>Парк *</label>
          <select
            value={formData.park}
            onChange={(e) => handleChange('park', e.target.value)}
            className="form-select"
          >
            <option value="Собственный">Собственный</option>
            <option value="Привлеченный">Привлеченный</option>
          </select>
          {errors.park && <span className="error-text">{errors.park}</span>}
        </div>

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {vehicle ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};