import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../../common/Button/Button';

export const QrSection = ({ 
  qr, 
  showPrintButtons, 
  onPrintQr, 
  onPrintAct, 
  onCreateNew, 
  onBack,
  apiUrl 
}) => {
  if (!qr) return null;

  return (
    <div className="qr-section" id="qrcode-section">
      <div className="success-message">
        <h3>Акт успешно создан!</h3>
        <p>ID: {qr}</p>
      </div>
      
      <QRCodeCanvas value={`${apiUrl}/vehicle-acts/${qr}`} size={200} />
      
      {showPrintButtons && (
        <div className="print-buttons">
          <Button type="button" onClick={onPrintQr} variant="primary">
            Распечатать QR код
          </Button>
          <Button type="button" onClick={onPrintAct} variant="primary">
            Распечатать акт
          </Button>
        </div>
      )}
      
      <div className="qr-buttons">
        <Button type="button" onClick={onCreateNew} variant="secondary">
          Создать новый осмотр
        </Button>
        <Button type="button" onClick={onBack} variant="secondary">
          Назад
        </Button>
      </div>
    </div>
  );
};