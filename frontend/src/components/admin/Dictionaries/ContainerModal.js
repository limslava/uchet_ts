import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const ContainerModal = ({ isOpen, onClose, onSubmit, container, loading }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    ownership: 'Собственные'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (container) {
      setFormData({
        number: container.number || '',
        type: container.type || '',
        ownership: container.ownership || 'Собственные'
      });
    } else {
      setFormData({
        number: '',
        type: '',
        ownership: 'Собственные'
      });
    }
    setErrors({});
  }, [container, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Номер контейнера обязателен';
    } else if (!/^[A-Z]{4}\d{7}$/.test(formData.number)) {
      newErrors.number = 'Номер контейнера должен состоять из 4 букв и 7 цифр';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Тип контейнера обязателен';
    }

    if (!formData.ownership) {
      newErrors.ownership = 'Принадлежность обязательна';
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
      title={container ? 'Редактировать контейнер' : 'Создать контейнер'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="container-form">
        <Input
          label="Номер контейнера *"
          value={formData.number}
          onChange={(value) => handleChange('number', value)}
          error={errors.number}
          placeholder="ABCD1234567"
          helpText="Формат: 4 буквы + 7 цифр (например: HHXU3124519)"
        />

        <Input
          label="Тип контейнера *"
          value={formData.type}
          onChange={(value) => handleChange('type', value)}
          error={errors.type}
          placeholder="Введите тип контейнера"
        />

        <div className="form-group">
          <label>Принадлежность *</label>
          <select
            value={formData.ownership}
            onChange={(e) => handleChange('ownership', e.target.value)}
            className="form-select"
          >
            <option value="Собственные">Собственные</option>
            <option value="Аренда">Аренда</option>
            <option value="Лизинг">Лизинг</option>
          </select>
          {errors.ownership && <span className="error-text">{errors.ownership}</span>}
        </div>

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {container ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};