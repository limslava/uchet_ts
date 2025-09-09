import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import './UserModal.css';

export const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'RECEIVER',
    locationId: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        role: user.role || 'RECEIVER',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'RECEIVER',
        isActive: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
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
      title={user ? 'Редактировать пользователя' : 'Создать пользователя'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="user-modal-form">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
          required
          disabled={!!user}
        />

        <Input
          label="Имя"
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          error={errors.name}
          required
        />

        <div className="form-group">
          <label>Роль</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="form-select"
          >
            <option value="RECEIVER">Приёмщик</option>
            <option value="MANAGER">Менеджер</option>
            <option value="ADMIN">Администратор</option>
          </select>
        </div>


        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            Активный пользователь
          </label>
        </div>

        {!user && (
          <Input
            label="Пароль"
            type="password"
            value={formData.password || ''}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            required={!user}
          />
        )}

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {user ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;