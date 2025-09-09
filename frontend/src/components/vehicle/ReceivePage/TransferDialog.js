import React from 'react';
import { Button } from '../../common/Button/Button';

export const TransferDialog = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  isSubmitting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>Передать данные</h3>
        <p>Вы уверены, что хотите передать данные?</p>
        <div className="dialog-buttons">
          <Button 
            type="button" 
            onClick={onCancel} 
            disabled={isSubmitting} 
            variant="secondary"
          >
            Нет
          </Button>
          <Button 
            type="button" 
            onClick={onConfirm} 
            disabled={isSubmitting} 
            variant="primary"
          >
            {isSubmitting ? 'Передача...' : 'Да'}
          </Button>
        </div>
      </div>
    </div>
  );
};