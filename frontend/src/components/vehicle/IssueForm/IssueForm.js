import React, { useState, useEffect } from 'react';
import './IssueForm.css';

const IssueForm = ({ vehicleAct, issueType, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    recipientName: vehicleAct.principal || '',
    recipientPhone: vehicleAct.principalPhone || '',
    recipientPassport: vehicleAct.principalPassport || ''
  });

  useEffect(() => {
    // Автозаполняем данные из акта приёмки
    setFormData({
      recipientName: vehicleAct.principal || '',
      recipientPhone: vehicleAct.principalPhone || '',
      recipientPassport: vehicleAct.principalPassport || ''
    });
  }, [vehicleAct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (issueType === 'RECIPIENT') {
      // Для выдачи грузополучателю отправляем только имя и телефон
      onSubmit({
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone
        // Паспортные данные не отправляем!
      });
    } else {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="issue-form">
      {issueType === 'RECIPIENT' && (
        <div className="recipient-fields">
          <div className="form-group">
            <label>ФИО получателя:</label>
            <input 
              type="text"
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Телефон получателя:</label>
            <input 
              type="tel"
              value={formData.recipientPhone}
              onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Паспортные данные (только просмотр):</label>
            <input 
              type="text"
              value={formData.recipientPassport || 'Не указано'}
              readOnly
              className="form-input readonly"
            />
            <small>Паспортные данные заполняются при создании акта</small>
          </div>
        </div>
      )}

      {issueType === 'TRANSPORT' && (
        <div className="transport-fields">
          <div className="form-group">
            <label>Тип транспорта:</label>
            <select 
              onChange={(e) => handleInputChange('transportType', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Выберите тип</option>
              <option value="auto">Автотранспорт</option>
              <option value="railway">ЖД транспорт</option>
              <option value="air">Авиаперевозка</option>
              <option value="marine">Морской транспорт</option>
            </select>
          </div>

          {/* Поля для автотранспорта */}
          {formData.transportType === 'auto' && (
            <>
              <div className="form-group">
                <label>Гос. номер ТС:</label>
                <input 
                  type="text"
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>ФИО водителя:</label>
                <input 
                  type="text"
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Телефон водителя:</label>
                <input 
                  type="tel"
                  onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </>
          )}

          {/* Добавьте поля для других типов транспорта */}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Подтвердить выдачу
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Назад
        </button>
      </div>
    </form>
  );
};

export default IssueForm;