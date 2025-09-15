import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleQrScanner from '../SimpleQrScanner/SimpleQrScanner';
import { getVehicleActById, issueVehicle, getContainers  } from '../../../services/api';
import './ContainerStuffing.css';

const ContainerStuffing = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState('');
  const [sealNumber, setSealNumber] = useState('');
  const [scannedVehicles, setScannedVehicles] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    loadContainers();
  }, []);

const loadContainers = useCallback(async () => {
  try {
    console.log('Загрузка контейнеров...');
    const containersData = await getContainers();
    
    console.log('Контейнеры получены:', containersData);
    
    // Улучшенная проверка структуры ответа
    if (Array.isArray(containersData)) {
      setContainers(containersData);
    } else if (containersData && Array.isArray(containersData.containers)) {
      setContainers(containersData.containers);
    } else if (containersData && Array.isArray(containersData.data)) {
      setContainers(containersData.data);
    } else {
      console.warn('Неожиданный формат данных контейнеров:', containersData);
      setContainers([]);
    }
  } catch (error) {
    console.error('Ошибка загрузки контейнеров:', error);
    alert('Не удалось загрузить список контейнеров');
    setContainers([]);
  }
}, []);

 const handleScanSuccess = async (decodedText) => {
  try {
    let actId = decodedText;
    
    if (decodedText && decodedText.includes('/vehicle-acts/')) {
      const urlParts = decodedText.split('/vehicle-acts/');
      actId = urlParts[urlParts.length - 1];
    }

    // Проверяем на дубликаты по ID и VIN
    if (scannedVehicles.some(v => v.id === actId || v.vin === decodedText)) {
      alert('Это ТС уже отсканировано!');
      setShowScanner(false); // Автоматически закрываем сканер
      return;
    }

    const scannedAct = await getVehicleActById(actId);
    
    // Проверка локации
    const user = JSON.parse(localStorage.getItem('user'));
    if (scannedAct.LocationId !== user.locationId) {
      alert(`Ошибка локации! ТС находится на "${scannedAct.Location?.name}", а вы на "${user.location?.name}"`);
      setShowScanner(false);
      return;
    }

    // Проверка статуса
    if (scannedAct.status !== 'RECEIVED') {
      alert('ТС должно быть сначала принято перед отгрузкой');
      setShowScanner(false);
      return;
    }

    setScannedVehicles(prev => [...prev, scannedAct]);
    setShowScanner(false); // Закрываем сканер после успешного сканирования
  } catch (error) {
    console.error('Ошибка обработки сканирования:', error);
    alert('Не удалось найти акт по этому QR-коду');
    setShowScanner(false);
  }
};

  const removeVehicle = (index) => {
    setScannedVehicles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
  if (!selectedContainer) {
    alert('Выберите контейнер');
    return;
  }

  if (scannedVehicles.length === 0) {
    alert('Отсканируйте хотя бы одно ТС');
    return;
  }

  try {
    setLoading(true);
    
    // Отгружаем каждое ТС отдельно
    const results = [];
    for (const vehicle of scannedVehicles) {
      try {
        const issueData = {
          issueType: 'CONTAINER',
          issueData: {
            containerNumber: selectedContainer,
            sealNumber: sealNumber,
            loadedAt: new Date().toISOString()
          }
        };

        const result = await issueVehicle(vehicle.id, issueData);
        results.push({ success: true, vehicle: vehicle.contractNumber, result });
      } catch (error) {
        console.error(`Ошибка отгрузки ТС ${vehicle.contractNumber}:`, error);
        results.push({ 
          success: false, 
          vehicle: vehicle.contractNumber, 
          error: error.response?.data?.error || error.message 
        });
      }
    }
    
    // Проверяем результаты
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      alert(`Ошибка при отгрузке некоторых ТС: ${failed.map(f => f.vehicle).join(', ')}`);
    } else {
      alert('Отгрузка успешно оформлена!');
      navigate('/');
    }
  } catch (error) {
    console.error('Общая ошибка оформления отгрузки:', error);
    alert(error.response?.data?.error || 'Ошибка оформления отгрузки');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (scannedVehicles.length > 0 || selectedContainer || sealNumber) {
      setShowConfirmCancel(true);
    } else {
      resetForm();
      navigate('/transport-type');
    }
  };

  const resetForm = () => {
    setSelectedContainer('');
    setSealNumber('');
    setScannedVehicles([]);
    setShowConfirmCancel(false);
  };

  const confirmCancel = () => {
    resetForm();
    navigate('/transport-type');
  };

  return (
    <div className="container-stuffing">
      <h2>Отгрузка в контейнер</h2>
      
      <div className="form-section">
        <label>Дата погрузки:</label>
        <input 
          type="text" 
          value={new Date().toLocaleDateString('ru-RU')} 
          readOnly 
          className="readonly-input"
        />
      </div>

      <div className="form-section">
  <label>Номер контейнера:</label>
  <select 
    value={selectedContainer} 
    onChange={(e) => setSelectedContainer(e.target.value)}
    className="container-select"
    required
  >
    <option value="">Выберите контейнер</option>
    {containers.map(container => (
      <option key={container.id} value={container.number}>
        {container.number} {/* Убрали лишнюю информацию */}
      </option>
    ))}
  </select>
</div>

      <div className="form-section">
        <label>Номер пломбы:</label>
        <input 
          type="text"
          value={sealNumber}
          onChange={(e) => setSealNumber(e.target.value)}
          placeholder="Введите номер пломбы"
          className="form-input"
        />
      </div>

      <div className="scan-section">
        <button 
          onClick={() => setShowScanner(true)} 
          className="btn btn-primary"
        >
          Сканировать QR код ТС
        </button>
        
        {showScanner && (
  <div className="scanner-modal">
    <div className="scanner-content">
      <SimpleQrScanner 
        onScanSuccess={handleScanSuccess}
        onClose={() => setShowScanner(false)}
      />
    </div>
  </div>
)}
      </div>

      {scannedVehicles.length > 0 && (
        <div className="scanned-vehicles">
          <h3>Отсканированные ТС ({scannedVehicles.length}):</h3>
          {scannedVehicles.map((vehicle, index) => (
            <div key={index} className="vehicle-card">
              <div className="vehicle-info">
                <p><strong>Договор:</strong> {vehicle.contractNumber}</p>
                <p><strong>Марка:</strong> {vehicle.carBrand?.name}</p>
                <p><strong>Модель:</strong> {vehicle.carModel?.name}</p>
                <p><strong>Цвет:</strong> {vehicle.color}</p>
                <p><strong>Гос.номер:</strong> {vehicle.licensePlate}</p>
                <p><strong>Направление:</strong> {vehicle.direction?.name}</p>
                <p><strong>Способ перевозки:</strong> {vehicle.transportMethod?.name}</p>
                <p><strong>Статус:</strong> {
            vehicle.status === 'NEW' ? 'Новый' :
            vehicle.status === 'RECEIVED' ? 'Принят' :
            vehicle.status === 'COMPLETED' ? 'Завершен' :
            vehicle.status === 'CANCELLED' ? 'Отменен' :
            vehicle.status === 'LOADED_INTO_CONTAINER' ? 'Погружен в контейнер' :
            vehicle.status
          }</p>
              </div>
              <button 
                onClick={() => removeVehicle(index)}
                className="btn btn-danger btn-small"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons">
        <button 
          onClick={handleSubmit} 
          disabled={loading || scannedVehicles.length === 0}
          className="btn btn-primary"
        >
          {loading ? 'Сохранение...' : 'Отгрузить в контейнер'}
        </button>
        
        <button onClick={handleCancel} className="btn btn-secondary">
          Отменить
        </button>
        
        <button onClick={() => navigate('/transport-type')} className="btn btn-secondary">
          Назад к выбору типа
        </button>
        
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Назад в главное меню
        </button>
      </div>

      {showConfirmCancel && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Подтверждение</h3>
            <p>Вы уверены, что хотите отменить и начать заново? Все введенные данные будут потеряны.</p>
            <div className="modal-buttons">
              <button onClick={confirmCancel} className="btn btn-danger">
                Да, отменить
              </button>
              <button onClick={() => setShowConfirmCancel(false)} className="btn btn-secondary">
                Нет, продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerStuffing;