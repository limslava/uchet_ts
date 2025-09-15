import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleQrScanner from '../SimpleQrScanner/SimpleQrScanner';
import { getVehicleActById, issueVehicle, getCompanyVehicles } from '../../../services/api';
import './AutocarrierLoading.css';

const AutocarrierLoading = () => {
  const navigate = useNavigate();
  const [scannedVehicles, setScannedVehicles] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [ownershipType, setOwnershipType] = useState('Собственный'); // Собственный/Привлеченный
  const [selectedVehicle, setSelectedVehicle] = useState(''); // Выбранное ТС из справочника
  const [customTruckNumber, setCustomTruckNumber] = useState(''); // Гос. номер для привлеченного
  const [companyVehicles, setCompanyVehicles] = useState([]); // Список ТС из справочника

  // Загружаем список ТС перевозчиков
  useEffect(() => {
    loadCompanyVehicles();
  }, []);

  const loadCompanyVehicles = async () => {
  try {
    const response = await getCompanyVehicles({ isActive: 'true' });
    
    // Ответ должен быть простым массивом (как для контейнеров)
    if (Array.isArray(response)) {
      setCompanyVehicles(response);
    } else {
      console.warn('Неожиданный формат данных ТС перевозчиков:', response);
      setCompanyVehicles([]);
    }
  } catch (error) {
    console.error('Ошибка загрузки ТС перевозчиков:', error);
    alert('Не удалось загрузить список ТС перевозчиков');
    setCompanyVehicles([]);
  }
};
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
        setShowScanner(false);
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
        alert('ТС должно быть сначала принято перед погрузкой');
        setShowScanner(false);
        return;
      }

      setScannedVehicles(prev => [...prev, scannedAct]);
      setShowScanner(false);
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
  // Валидация в зависимости от типа собственности
  if (ownershipType === 'Собственный' && !selectedVehicle) {
    alert('Выберите ТС из списка');
    return;
  }

  if (ownershipType === 'Привлеченный' && !customTruckNumber.trim()) {
    alert('Введите гос. номер автовоза');
    return;
  }

  if (scannedVehicles.length === 0) {
    alert('Отсканируйте хотя бы одно ТС');
    return;
  }

  try {
    setLoading(true);
    
    const results = [];
    for (const vehicle of scannedVehicles) {
      try {
        let truckInfo = {};
        
        if (ownershipType === 'Собственный') {
          const selectedCompanyVehicle = companyVehicles.find(v => v.id === parseInt(selectedVehicle));
          truckInfo = {
            ownership: 'Собственный',
            truckId: selectedCompanyVehicle.id,
            truckNumber: selectedCompanyVehicle.licensePlate // ТОЛЬКО НОМЕР
          };
        } else {
          truckInfo = {
            ownership: 'Привлеченный',
            truckNumber: customTruckNumber.trim()
          };
        }

        const issueData = {
          issueType: 'AUTOCARRIER',
          issueData: {
            ...truckInfo,
            loadedAt: new Date().toISOString()
          }
        };

        const result = await issueVehicle(vehicle.id, issueData);
        results.push({ success: true, vehicle: vehicle.contractNumber, result });
      } catch (error) {
        console.error(`Ошибка погрузки ТС ${vehicle.contractNumber}:`, error);
        results.push({ 
          success: false, 
          vehicle: vehicle.contractNumber, 
          error: error.response?.data?.error || error.message 
        });
      }
    }
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      alert(`Ошибка при погрузке некоторых ТС: ${failed.map(f => f.vehicle).join(', ')}`);
    } else {
      alert('Погрузка на автовоз успешно оформлена!');
      navigate('/');
    }
  } catch (error) {
    console.error('Общая ошибка оформления погрузки:', error);
    alert(error.response?.data?.error || 'Ошибка оформления погрузки');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (scannedVehicles.length > 0 || selectedVehicle || customTruckNumber) {
      setShowConfirmCancel(true);
    } else {
      resetForm();
      navigate('/transport-type');
    }
  };

  const resetForm = () => {
    setOwnershipType('Собственный');
    setSelectedVehicle('');
    setCustomTruckNumber('');
    setScannedVehicles([]);
    setShowConfirmCancel(false);
  };

  const confirmCancel = () => {
    resetForm();
    navigate('/transport-type');
  };

  return (
    <div className="autocarrier-loading">
      <h2>Погрузка на автовоз</h2>
      
      <div className="info-section">
        <label>Дата погрузки:</label>
        <input 
          type="text" 
          value={new Date().toLocaleDateString('ru-RU')} 
          readOnly 
          className="readonly-input"
        />
      </div>

      <div className="form-section">
        <label>Собственность автовоза:</label>
        <select 
          value={ownershipType} 
          onChange={(e) => {
            setOwnershipType(e.target.value);
            setSelectedVehicle('');
            setCustomTruckNumber('');
          }}
          className="form-select"
        >
          <option value="Собственный">Собственный</option>
          <option value="Привлеченный">Привлеченный</option>
        </select>
      </div>

     {ownershipType === 'Собственный' && (
  <div className="form-section">
    <label>Выберите автовоз:</label>
    <select 
      value={selectedVehicle} 
      onChange={(e) => setSelectedVehicle(e.target.value)}
      className="form-select"
      required
    >
      <option value="">Выберите автовоз</option>
      {companyVehicles
        .filter(vehicle => vehicle.park === 'Собственный')
        .map(vehicle => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.licensePlate} {/* ТОЛЬКО ГОС. НОМЕР */}
          </option>
        ))}
    </select>
  </div>
)}

      {ownershipType === 'Привлеченный' && (
        <div className="form-section">
          <label>Гос. номер автовоза:</label>
          <input 
            type="text"
            value={customTruckNumber}
            onChange={(e) => setCustomTruckNumber(e.target.value)}
            placeholder="Введите гос. номер автовоза"
            className="form-input"
            required
          />
        </div>
      )}

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
                  vehicle.status === 'LOADED_INTO_GRID' ? 'Погружен в сетку' :
                  vehicle.status === 'LOADED_INTO_CURTAIN_TRUCK' ? 'Погружен в автовоз-штору' :
                  vehicle.status === 'LOADED_INTO_AUTOCARRIER' ? 'Отгружен на автовоз' :
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
          disabled={loading || scannedVehicles.length === 0 || 
            (ownershipType === 'Собственный' && !selectedVehicle) ||
            (ownershipType === 'Привлеченный' && !customTruckNumber.trim())}
          className="btn btn-primary"
        >
          {loading ? 'Сохранение...' : 'Отгрузить на автовоз'}
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

export default AutocarrierLoading;