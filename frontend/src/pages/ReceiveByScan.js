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
      if (decodedText.includes('/vehicle-acts/')) {
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
    if (!error.message.includes('No MultiFormat Readers')) {
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
      <button 
        onClick={() => navigate('/')}
        className="btn-back"
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Назад
      </button>
      
      <h2>Прием ТС по QR-коду</h2>
      
      {!scanResult && (
        <>
          <QrScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
          {loading && <p>Загрузка...</p>}
        </>
      )}
      
      {error && <div className="error">{error}</div>}
      
      {scanResult && (
        <div className="scan-result">
          <h3>Найден акт:</h3>
          <p><strong>Номер акта:</strong> {scanResult.contractNumber}</p>
          <p><strong>VIN:</strong> {scanResult.vin}</p>
          <p><strong>Марка:</strong> {scanResult.carBrand?.name}</p>
          <p><strong>Модель:</strong> {scanResult.carModel?.name}</p>
          
          <div className="action-buttons">
            <button onClick={confirmReceipt} className="btn-primary">
              Подтвердить прием
            </button>
            <button onClick={() => setScanResult(null)} className="btn-secondary">
              Сканировать снова
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiveByScan;