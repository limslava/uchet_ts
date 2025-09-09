import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const LocationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  location, 
  cities = [],
  loading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: ''
  });
  const [newCity, setNewCity] = useState('');
  const [showNewCity, setShowNewCity] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        address: location.address || '',
        city: location.city || ''
      });
      setShowNewCity(false);
      setNewCity('');
    } else {
      setFormData({
        name: '',
        address: '',
        city: ''
      });
      setNewCity('');
      setShowNewCity(false);
    }
    setErrors({});
  }, [location, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название локации обязательно';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен';
    }

    if (!formData.city && !newCity.trim()) {
      newErrors.city = 'Выберите город или создайте новый';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = { ...formData };
    
    // Используем новый город если выбран
    if (newCity.trim() && !formData.city) {
      submitData.city = newCity.trim();
    }

    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={location ? 'Редактировать локацию' : 'Создать локацию'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="location-form">
        <div className="form-group">
          <label>Локация *</label>
          <Input
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            error={errors.name}
            placeholder="Введите название локации"
          />
        </div>

        <div className="form-group">
          <label>Адрес *</label>
          <Input
            value={formData.address}
            onChange={(value) => handleChange('address', value)}
            error={errors.address}
            placeholder="Введите адрес"
          />
        </div>

        <div className="form-group">
          <label>Город *</label>
          {!showNewCity ? (
            <>
              <select
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="form-select"
              >
                <option value="">-- Выберите город --</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => setShowNewCity(true)}
              >
                + Создать новый город
              </Button>
              {errors.city && <span className="error-text">{errors.city}</span>}
            </>
          ) : (
            <>
              <Input
                value={newCity}
                onChange={setNewCity}
                placeholder="Введите название нового города"
              />
              <Button
                type="button"
                variant="text"
                size="small"
                onClick={() => {
                  setShowNewCity(false);
                  setNewCity('');
                }}
              >
                ← Выбрать существующий город
              </Button>
            </>
          )}
        </div>

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {location ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};