import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from '../../components/vehicle/QrScanner/QrScanner';
import { getVehicleActById, issueVehicle } from '../../services/api';
import './IssueByScan.css';

const IssueByScan = () => {
  const [step, setStep] = useState('type-selection');
  const [issueType, setIssueType] = useState(null);
  const [transportType, setTransportType] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleIssueTypeSelect = (type) => {
  setIssueType(type);
  
  if (type === 'RECIPIENT') {
    setStep('scanning');
  } else if (type === 'TRANSPORT') {
    // Переходим к выбору типа отгрузки
    navigate('/transport-type'); // Изменили на transport-type
  }
};

  const handleTransportSelect = (type) => {
    setTransportType(type);
    setStep('scan-for-transport');
  };

  const handleScanSuccess = async (decodedText) => {
    setLoading(true);
    setError('');
    
    try {
      let actId = decodedText;
      
      if (decodedText && decodedText.includes('/vehicle-acts/')) {
        const urlParts = decodedText.split('/vehicle-acts/');
        actId = urlParts[urlParts.length - 1];
      }
      
      const vehicleAct = await getVehicleActById(actId);
      
      if (vehicleAct.status !== 'RECEIVED') {
        setError('ТС должно быть сначала принято перед выдачей');
        return;
      }
      
      setScanResult(vehicleAct);
      
      // РАЗДЕЛЯЕМ логику для разных типов выдачи
      if (issueType === 'RECIPIENT') {
        setStep('confirmation');
      } else if (issueType === 'TRANSPORT') {
        // Для транспорта после сканирования показываем выбор типа
        setStep('transport-selection');
      }
    } catch (err) {
      setError('Акт не найден или ошибка сканирования');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanForTransportSuccess = async (decodedText) => {
    setLoading(true);
    setError('');
    
    try {
      let actId = decodedText;
      
      if (decodedText && decodedText.includes('/vehicle-acts/')) {
        const urlParts = decodedText.split('/vehicle-acts/');
        actId = urlParts[urlParts.length - 1];
      }
      
      const vehicleAct = await getVehicleActById(actId);
      
      if (vehicleAct.status !== 'RECEIVED') {
        setError('ТС должно быть сначала принято перед выдачей');
        return;
      }
      
      setScanResult(vehicleAct);
      
      // После сканирования для транспорта переходим на страницу контейнера
      if (transportType === 'container') {
        navigate(`/container-stuffing/${vehicleAct.id}`);
      } else {
        setStep('confirmation');
      }
    } catch (err) {
      setError('Акт не найден или ошибка сканирования');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (error) => {
    console.error('Scanner error:', error);
  };

  const handleIssueSubmit = async () => {
    try {
      await issueVehicle(scanResult.id, {
        issueType,
        issueData: {
          issuedAt: new Date().toISOString()
        }
      });
      alert('Выдача ТС успешно оформлена!');
      navigate('/');
    } catch (err) {
      setError('Ошибка оформления выдачи: ' + (err.response?.data?.error || err.message));
      console.error('Issue error:', err);
    }
  };

  const handleBack = () => {
    if (step === 'scanning') {
      setStep('type-selection');
      setIssueType(null);
    } else if (step === 'confirmation') {
      setStep('scanning');
      setScanResult(null);
    } else if (step === 'transport-selection') {
      setStep('scanning');
      setScanResult(null);
    } else if (step === 'scan-for-transport') {
      setStep('transport-selection');
    }
  };

  const transportTypes = [
    { id: 'autocarrier', name: 'Автовоз', icon: '🚛' },
    { id: 'container', name: 'Контейнер', icon: '📦' },
    { id: 'net', name: 'Сетка', icon: '🔲' },
    { id: 'truck', name: 'Фура', icon: '🚚' }
  ];

  return (
    <div className="issue-by-scan">
      <h2>Выдача ТС по QR-коду</h2>
      
      {error && <div className="error">{error}</div>}
      
      {/* Шаг 1: Выбор типа выдачи */}
      {step === 'type-selection' && (
        <div className="issue-type-selection">
          <h3>Выберите тип выдачи:</h3>
          <div className="issue-type-buttons">
            <button 
              onClick={() => handleIssueTypeSelect('RECIPIENT')}
              className="btn btn-primary"
            >
              Выдача грузополучателю
            </button>
            <button 
              onClick={() => handleIssueTypeSelect('TRANSPORT')}
              className="btn btn-secondary"
            >
              Отгрузка
            </button>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Назад в меню
            </button>
          </div>
        </div>
      )}
      
      {/* Шаг 2: Сканирование для определения типа выдачи */}
      {step === 'scanning' && (
        <div className="scanning-step">
          <h3>Сканирование QR-кода ТС</h3>
          <QrScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            showCameraSelection={true}
          />
          {loading && <p>Загрузка...</p>}
          <button onClick={handleBack} className="btn btn-secondary back-button">
            Назад к выбору типа
          </button>
        </div>
      )}
      
      {/* Шаг 3: Выбор типа транспорта после сканирования */}
      {step === 'transport-selection' && scanResult && (
        <div className="transport-type-selection">
          <h3>Выберите тип отгрузки для ТС:</h3>
          <div className="act-info">
            <p><strong>Договор:</strong> {scanResult.contractNumber}</p>
            <p><strong>Марка:</strong> {scanResult.carBrand?.name}</p>
            <p><strong>Модель:</strong> {scanResult.carModel?.name}</p>
          </div>
          <div className="transport-grid">
            {transportTypes.map(type => (
              <button
                key={type.id}
                className="transport-btn"
                onClick={() => handleTransportSelect(type.id)}
              >
                <span className="transport-icon">{type.icon}</span>
                <span className="transport-name">{type.name}</span>
              </button>
            ))}
          </div>
          <div className="action-buttons">
            <button onClick={() => setStep('scanning')} className="btn btn-secondary">
              Назад к сканированию
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Назад в главное меню
            </button>
          </div>
        </div>
      )}
      
      {/* Шаг 4: Сканирование для конкретного типа транспорта */}
      {step === 'scan-for-transport' && (
        <div className="scanning-step">
          <h3>Сканирование QR-кода ТС для отгрузки ({transportType})</h3>
          <QrScanner 
            onScanSuccess={handleScanForTransportSuccess}
            onScanError={handleScanError}
            showCameraSelection={true}
          />
          {loading && <p>Загрузка...</p>}
          <button onClick={handleBack} className="btn btn-secondary back-button">
            Назад к выбору типа
          </button>
        </div>
      )}
      
      {/* Шаг 5: Подтверждение выдачи грузополучателю */}
      {step === 'confirmation' && issueType === 'RECIPIENT' && scanResult && (
        <div className="confirmation-step">
          <h3>Подтверждение выдачи грузополучателю</h3>
          
          <div className="act-details">
            <h4>Данные акта:</h4>
            <p><strong>Договор №:</strong> {scanResult.contractNumber}</p>
            <p><strong>Марка:</strong> {scanResult.carBrand?.name}</p>
            <p><strong>Модель:</strong> {scanResult.carModel?.name}</p>
            <p><strong>Гос.номер:</strong> {scanResult.licensePlate}</p>
            <p><strong>VIN:</strong> {scanResult.vin}</p>
          </div>
          
          <div className="recipient-info">
            <h4>Данные получателя:</h4>
            <div className="info-row">
              <label>ФИО получателя:</label>
              <span>{scanResult.principal || 'Не указано'}</span>
            </div>
            <div className="info-row">
              <label>Телефон получателя:</label>
              <span>{scanResult.principalPhone || 'Не указано'}</span>
            </div>
            <div className="info-row">
              <label>Паспортные данные:</label>
              <span>{scanResult.principalPassport || 'Не указано'}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button onClick={handleIssueSubmit} className="btn btn-primary">
              Подтвердить выдачу
            </button>
            <button onClick={handleBack} className="btn btn-secondary">
              Назад к сканированию
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueByScan;