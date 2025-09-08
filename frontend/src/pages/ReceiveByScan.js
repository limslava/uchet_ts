import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from '../components/QrScanner';
import { getVehicleActById, confirmVehicleReceipt } from '../services/api';
import '../styles/QrScanner.css';

const ReceiveByScan = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText) => {
    setLoading(true);
    setError('');
    
    try {
      // Извлекаем ID акта из URL
      let actId = decodedText;
      
      // Если это URL, извлекаем только ID
      if (decodedText && decodedText.includes('/vehicle-acts/')) {
        const urlParts = decodedText.split('/vehicle-acts/');
        actId = urlParts[urlParts.length - 1];
      }
      
      const vehicleAct = await getVehicleActById(actId);
      
      setScanResult(vehicleAct);
    } catch (err) {
      setError('Акт не найден или ошибка сканирования');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (error) => {
    // Игнорируем ошибки "QR code not found"
    if (error && error.message && !error.message.includes('No MultiFormat Readers')) {
      console.error('Scanner error:', error);
    }
  };

  const confirmReceipt = async () => {
    try {
      await confirmVehicleReceipt(scanResult.id);
      alert('Прием ТС подтвержден!');
      setScanResult(null);
    } catch (err) {
      setError('Ошибка подтверждения приема');
      console.error('Confirm receipt error:', err);
    }
  };

  return (
    <div className="receive-by-scan">
      <h2>Прием ТС по QR-коду</h2>
      
      {!scanResult && (
        <>
          <QrScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            showCameraSelection={true}
          />
          {loading && <p>Загрузка...</p>}
        </>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {scanResult && (
        <div className="scan-result">
          <h3>Найден Акт:</h3>
          <div className="act-details">
            <p><strong>Договор №:</strong> {scanResult.contractNumber}</p>
            <p><strong>Марка:</strong> {scanResult.carBrand?.name || 'Не указано'}</p>
            <p><strong>Модель:</strong> {scanResult.carModel?.name || 'Не указано'}</p>
            <p><strong>Гос.номер:</strong> {scanResult.licensePlate || 'Не указано'}</p>
            <p><strong>Цвет:</strong> {scanResult.color || 'Не указано'}</p>
            <p><strong>VIN:</strong> {scanResult.vin || 'Не указано'}</p>
            <p><strong>Направление:</strong> {scanResult.direction?.name || 'Не указано'}</p>
            <p><strong>Способ перевозки:</strong> {scanResult.transportMethod?.name || 'Не указано'}</p>
          </div>
          
          <div className="action-buttons">
            <button onClick={confirmReceipt} className="btn-primary">
              Подтвердить прием
            </button>
            <button onClick={() => setScanResult(null)} className="btn-secondary">
              Сканировать снова
            </button>
            <button onClick={() => navigate('/')} className="btn-back">
              Назад
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiveByScan;