import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const TransportMethodModal = ({ isOpen, onClose, onSubmit, method, loading }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (method) {
      setName(method.name || '');
    } else {
      setName('');
    }
    setError('');
  }, [method, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Название способа перевозки обязательно');
      return;
    }

    onSubmit({ name: name.trim() });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={method ? 'Редактировать способ перевозки' : 'Создать способ перевозки'}
      size="small"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Способ перевозки *</label>
          <Input
            value={name}
            onChange={setName}
            error={error}
            placeholder="Введите способ перевозки"
          />
        </div>

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {method ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};