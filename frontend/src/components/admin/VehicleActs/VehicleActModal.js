import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import './VehicleActModal.css';

export const VehicleActModal = ({
  isOpen,
  onClose,
  onSubmit,
  act = null,
  loading = false,
  onPrintAct = null,
  onPrintContract = null
}) => {
  const [formData, setFormData] = useState({
    principal: '',
    sender: '',
    principalPhone: '',
    senderPhone: '',
    principalPassport: '',
    transportCost: '',
    bodyType: '',
    vin: '',
    licensePlate: '',
    color: '',
    year: '',
    status: 'NEW'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (act) {
      setFormData({
        principal: act.principal || '',
        sender: act.sender || '',
        principalPhone: act.principalPhone || '',
        senderPhone: act.senderPhone || '',
        principalPassport: act.principalPassport || '',
        transportCost: act.transportCost || '',
        bodyType: act.bodyType || '',
        vin: act.vin || '',
        licensePlate: act.licensePlate || '',
        color: act.color || '',
        year: act.year?.toString() || '',
        status: act.status || 'NEW'
      });
    } else {
      setFormData({
        principal: '',
        sender: '',
        principalPhone: '',
        senderPhone: '',
        principalPassport: '',
        transportCost: '',
        bodyType: '',
        vin: '',
        licensePlate: '',
        color: '',
        year: '',
        status: 'NEW'
      });
    }
    setErrors({});
  }, [act, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vin.trim()) {
      newErrors.vin = 'VIN обязателен';
    } else if (formData.vin.length !== 17) {
      newErrors.vin = 'VIN должен содержать 17 символов';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Гос. номер обязателен';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Цвет обязателен';
    }

    if (!formData.year) {
      newErrors.year = 'Год выпуска обязателен';
    } else if (parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear() + 1) {
      newErrors.year = 'Некорректный год выпуска';
    }

    if (formData.principalPhone && !validatePhone(formData.principalPhone)) {
      newErrors.principalPhone = 'Телефон должен быть в формате +7XXXXXXXXXX';
    }

    if (formData.senderPhone && !validatePhone(formData.senderPhone)) {
      newErrors.senderPhone = 'Телефон должен быть в формате +7XXXXXXXXXX';
    }

    if (formData.transportCost && isNaN(parseFloat(formData.transportCost))) {
      newErrors.transportCost = 'Стоимость должна быть числом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        year: parseInt(formData.year),
        transportCost: formData.transportCost ? parseFloat(formData.transportCost) : null
      };
      onSubmit(submitData);
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      NEW: 'Новый',
      RECEIVED: 'Принят',
      COMPLETED: 'Завершен',
      CANCELLED: 'Отменен'
    };
    return statuses[status] || status;
  };

  const renderField = (label, value, isLast = false) => (
    <div className="info-row" style={isLast ? { marginBottom: 0 } : {}}>
      <span className="info-label">{label}:</span>
      <span className="info-value">{value || '—'}</span>
    </div>
  );

  const getFuelLevelLabel = (level) => {
    const levels = {
      EMPTY: 'Пустой',
      QUARTER: '1/4',
      HALF: '1/2',
      THREE_QUARTERS: '3/4',
      FULL: 'Полный'
    };
    return levels[level] || level;
  };

  const getInspectionTimeLabel = (time) => {
    const times = {
      DAY: 'День',
      NIGHT: 'Ночь',
      RAIN: 'Дождь',
      SNOW: 'Снег'
    };
    return times[time] || time;
  };

  const getExternalConditionLabel = (condition) => {
    const conditions = {
      CLEAN: 'Чистый',
      DIRTY: 'Грязный',
      WET: 'Мокрый',
      DUSTY: 'Пыльный',
      SNOWY: 'Засыпан снегом',
      ICY: 'Обледеневший'
    };
    return conditions[condition] || condition;
  };

  const getInteriorConditionLabel = (condition) => {
    const conditions = {
      CLEAN: 'Чистый',
      DIRTY: 'Грязный',
      DAMAGED: 'Поврежденный'
    };
    return conditions[condition] || condition;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return amount ? new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount) : '—';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={act ? `Акт ${act.contractNumber}` : 'Создать акт'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="vehicle-act-form">
        {act && (
          <div className="act-info">
            {renderField('Номер договора', act.contractNumber)}
            {renderField('Дата создания', formatDate(act.createdAt))}
            {renderField('Статус', getStatusLabel(act.status))}
            {act.user && renderField('Создал', `${act.user.name} (${act.user.email})`)}
            {act.Location && renderField('Локация', act.Location.name)}
            {act.direction && renderField('Направление', act.direction.name)}
            {act.transportMethod && renderField('Способ перевозки', act.transportMethod.name)}
            {renderField('', '', true)}
          </div>
        )}

        <div className="form-grid">
          <Input
            label="Принципал/Получатель *"
            value={formData.principal}
            onChange={(value) => handleChange('principal', value)}
            error={errors.principal}
            required
          />

          <Input
            label="Телефон Принципала"
            value={formData.principalPhone}
            onChange={(value) => handleChange('principalPhone', value)}
            error={errors.principalPhone}
            placeholder="+7XXXXXXXXXX"
          />

          <Input
            label="Паспорт Принципала"
            value={formData.principalPassport}
            onChange={(value) => handleChange('principalPassport', value)}
            error={errors.principalPassport}
          />

          <Input
            label="Отправитель"
            value={formData.sender}
            onChange={(value) => handleChange('sender', value)}
            error={errors.sender}
          />

          <Input
            label="Телефон Отправителя"
            value={formData.senderPhone}
            onChange={(value) => handleChange('senderPhone', value)}
            error={errors.senderPhone}
            placeholder="+7XXXXXXXXXX"
          />

          <Input
            label="Стоимость перевозки (руб)"
            type="number"
            value={formData.transportCost}
            onChange={(value) => handleChange('transportCost', value)}
            error={errors.transportCost}
            min="0"
            step="0.01"
          />

          <Input
            label="Тип кузова"
            value={formData.bodyType}
            onChange={(value) => handleChange('bodyType', value)}
            error={errors.bodyType}
          />

          <Input
            label="VIN *"
            value={formData.vin}
            onChange={(value) => handleChange('vin', value)}
            error={errors.vin}
            required
            disabled={!!act}
          />

          <Input
            label="Гос. номер *"
            value={formData.licensePlate}
            onChange={(value) => handleChange('licensePlate', value)}
            error={errors.licensePlate}
            required
          />

          <Input
            label="Цвет *"
            value={formData.color}
            onChange={(value) => handleChange('color', value)}
            error={errors.color}
            required
          />

          <Input
            label="Год выпуска *"
            type="number"
            value={formData.year}
            onChange={(value) => handleChange('year', value)}
            error={errors.year}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
          />

          <div className="form-group">
            <label>Статус *</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="form-select"
            >
              <option value="NEW">Новый</option>
              <option value="RECEIVED">Принят</option>
              <option value="COMPLETED">Завершен</option>
              <option value="CANCELLED">Отменен</option>
            </select>
          </div>
        </div>

        {act && act.carBrand && act.carModel && (
          <div className="car-info">
            <h4>Информация об автомобиле</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Марка:</span>
                <span className="info-value">{act.carBrand.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Модель:</span>
                <span className="info-value">{act.carModel.name}</span>
              </div>
              {act.bodyType && (
                <div className="info-item">
                  <span className="info-label">Тип кузова:</span>
                  <span className="info-value">{act.bodyType}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {act && (
          <div className="car-info">
            <h4>Финансовая информация</h4>
            <div className="info-grid">
              {act.transportCost && (
                <div className="info-item">
                  <span className="info-label">Стоимость перевозки:</span>
                  <span className="info-value">{formatCurrency(act.transportCost)}</span>
                </div>
              )}
              {act.principalPhone && (
                <div className="info-item">
                  <span className="info-label">Телефон принципала:</span>
                  <span className="info-value">{act.principalPhone}</span>
                </div>
              )}
              {act.principalPassport && (
                <div className="info-item">
                  <span className="info-label">Паспорт принципала:</span>
                  <span className="info-value">{act.principalPassport}</span>
                </div>
              )}
              {act.senderPhone && (
                <div className="info-item">
                  <span className="info-label">Телефон отправителя:</span>
                  <span className="info-value">{act.senderPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {act && act.photos && act.photos.length > 0 && (
          <div className="photos-section">
            <h4>Фотографии ({act.photos.length})</h4>
            <div className="photos-grid">
              {act.photos.map((photo, index) => (
                <div key={photo.id} className="photo-item">
                  <img 
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${photo.filename}`}
                    alt={`Фото ${index + 1}`}
                    className="photo-thumbnail"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          {act && onPrintAct && (
            <Button type="button" variant="outline" onClick={() => onPrintAct(act)}>
              Распечатать акт
            </Button>
          )}
          {act && onPrintContract && (
            <Button type="button" variant="outline" onClick={() => onPrintContract(act)}>
              Распечатать договор
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button type="submit" loading={loading}>
            Сохранить изменения
          </Button>
        </div>
      </form>
    </Modal>
  );
};