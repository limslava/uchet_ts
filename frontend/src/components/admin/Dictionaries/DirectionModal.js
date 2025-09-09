import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';

export const DirectionModal = ({ isOpen, onClose, onSubmit, direction, loading }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (direction) {
      setName(direction.name || '');
    } else {
      setName('');
    }
    setError('');
  }, [direction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Название города обязательно');
      return;
    }

    onSubmit({ name: name.trim() });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={direction ? 'Редактировать город' : 'Создать город'}
      size="small"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Город *</label>
          <Input
            value={name}
            onChange={setName}
            error={error}
            placeholder="Введите название города"
          />
        </div>

        <div className="modal-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={loading}>
            {direction ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};