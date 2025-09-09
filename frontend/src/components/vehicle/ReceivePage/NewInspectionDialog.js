import React from 'react';
import { Button } from '../../common/Button/Button';

export const NewInspectionDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>Начать новый осмотр</h3>
        <p>Вы уверены, что хотите начать новый осмотр?</p>
        <div className="dialog-buttons">
          <Button 
            type="button" 
            onClick={onCancel} 
            variant="secondary"
          >
            Нет
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            variant="primary"
          >
            Да
          </Button>
        </div>
      </div>
    </div>
  );
};