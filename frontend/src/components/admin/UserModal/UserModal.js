import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { adminApi } from '../../../services/adminApi';
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
    isActive: true,
    password: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        role: user.role || 'RECEIVER',
        isActive: user.isActive !== undefined ? user.isActive : true,
        password: ''
      });
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'RECEIVER',
        isActive: true,
        password: ''
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

    if (!user && !formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Если это редактирование пользователя и пароль не пустой,
    // сначала обновляем пароль, затем отправляем основные данные
    if (user && formData.password) {
      try {
        await adminApi.resetPassword(user.id, { newPassword: formData.password });
      } catch (error) {
        alert(error.response?.data?.error || 'Ошибка при изменении пароля');
        return;
      }
    }
    
    // Отправляем основные данные (исключая пароль при редактировании)
    const { password, ...submitData } = formData;
    onSubmit(user ? submitData : formData);
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

        {!user ? (
          <Input
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            required
            autoComplete="new-password"
          />
        ) : (
          <Input
            label="Новый пароль (оставьте пустым, чтобы не менять)"
            type="password"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            autoComplete="new-password"
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