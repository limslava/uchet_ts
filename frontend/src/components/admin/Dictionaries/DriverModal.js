import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const DriverModal = ({ isOpen, onClose, onSubmit, driver, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driver) {
      setFormData({
        fullName: driver.fullName || '',
        phone: driver.phone || ''
      });
    } else {
      setFormData({
        fullName: '',
        phone: ''
      });
    }
    setErrors({});
  }, [driver, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно';
    }

    if (!formData.phone) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^\+7\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Телефон должен быть в формате +7XXXXXXXXXX (10 цифр после +7)';
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
      title={driver ? 'Редактировать водителя' : 'Создать водителя'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="driver-form">
        <Input
          label="ФИО *"
          value={formData.fullName}
          onChange={(value) => handleChange('fullName', value)}
          error={errors.fullName}
          placeholder="Введите ФИО водителя"
        />

        <Input
          label="Телефон *"
          value={formData.phone}
          onChange={(value) => handleChange('phone', value)}
          error={errors.phone}
          placeholder="+7XXXXXXXXXX"
          helpText="Формат: +7 и 10 цифр (например: +79147920000)"
        />

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {driver ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};