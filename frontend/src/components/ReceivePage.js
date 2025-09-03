import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import './ReceivePage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const EQUIPMENT_ITEMS = [
  { key: 'wipers', label: 'Щетки стеклоочистителя', options: ['нет', '1', '2', '3'] },
  { key: 'fogLights', label: 'Противотуманные фары', options: ['нет', '1', '2'] },
  { key: 'battery', label: 'АКБ', options: ['нет', '1', '2'] },
  { key: 'mirrorsOuter', label: 'Зеркала наружные', options: ['нет', '1', '2', '3', '4'] },
  { key: 'mirrorInner', label: 'Зеркало внутреннее', options: ['нет', '1', '2'] },
  { key: 'mudguards', label: 'Брызговики', options: ['нет', '1', '2', '3', '4'] },
  { key: 'wheelCaps', label: 'Колпаки колес', options: ['нет', '1', '2', '3', '4'] },
  { key: 'alloyWheels', label: 'Литые диски', options: ['нет', '1', '2', '3', '4'] },
  { key: 'ignitionKey', label: 'Ключ зажигания', options: ['нет', '1', '2', '3'] },
  { key: 'alarmFob', label: 'Брелок сигнализации', options: ['нет', '1', '2', '3', '4'] },
  { key: 'keyCylinder', label: 'Личинка ключа', options: ['нет', '1', '2'] },
  { key: 'keyCard', label: 'Ключ-карта', options: ['нет', '1', '2'] },
  { key: 'floorMats', label: 'Коврики', options: ['нет', '1', '2', '3', '4'] },
  { key: 'headrests', label: 'Подголовники', options: ['нет', '1', '2', '3', '4'] },
  { key: 'radio', label: 'Радиоприемник', options: ['нет', '1'] },
  { key: 'sdCard', label: 'Карта памяти', options: ['нет', '1'] },
  { key: 'monitor', label: 'Монитор', options: ['нет', '1'] },
  { key: 'repairKit', label: 'Рем.комплект', options: ['нет', '1'] },
  { key: 'spareWheel', label: 'Колесо запасное', options: ['нет', '1'] },
  { key: 'jack', label: 'Домкрат', options: ['нет', '1'] },
  { key: 'wheelWrench', label: 'Ключ-балонник', options: ['нет', '1'] },
  { key: 'trunkShelf', label: 'Шторка/полка багаж.', options: ['нет', '1'] },
  { key: 'dashCam', label: 'Видеорегистратор', options: ['нет', '1'] },
];

const INSPECTION_TIMES = ['день', 'темное время суток', 'дождь', 'снег'];
const EXTERNAL_CONDITIONS = ['Чистый', 'грязный', 'мокрый', 'в пыли', 'в снегу', 'обледенелый'];

export default function ReceivePage() {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [photos, setPhotos] = useState([]);
  const [qr, setQr] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showNewInspectionDialog, setShowNewInspectionDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isTakingPhotos, setIsTakingPhotos] = useState(false);
  const [vinError, setVinError] = useState(null);
  const [token, setToken] = useState('');
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [directions, setDirections] = useState([]);
  const [transportMethods, setTransportMethods] = useState([]);
  const [showPrintButtons, setShowPrintButtons] = useState(false);
  const [currentActId, setCurrentActId] = useState(null);
  const currentVin = watch('vin');

  // Авторизация при загрузке
  useEffect(() => {
    const login = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email: 'receiver@example.com',
          password: 'password123'
        });
        setToken(response.data.token);
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        alert('Ошибка авторизации');
      }
    };
    login();
  }, []);

  // Загрузка справочников
  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        console.log('Загрузка справочников...');
        
        const [dirsResponse, methodsResponse, brandsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/dictionaries/directions`),
          axios.get(`${API_URL}/api/dictionaries/transport-methods`),
          axios.get(`${API_URL}/api/car-brands`)
        ]);
        
        console.log('Направления:', dirsResponse.data);
        console.log('Способы перевозки:', methodsResponse.data);
        console.log('Марки:', brandsResponse.data);
        
        setDirections(dirsResponse.data);
        setTransportMethods(methodsResponse.data);
        setCarBrands(brandsResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };
    loadDictionaries();
  }, []);

  // Устанавливаем текущую дату
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setValue('date', currentDate);
  }, [setValue]);

  // Валидация VIN
  useEffect(() => {
    if (currentVin) {
      const error = validateVin(currentVin);
      setVinError(error);
    } else {
      setVinError(null);
    }
  }, [currentVin]);

  const validateVin = (vin) => {
    if (!vin || vin.trim().length === 0) {
      return 'VIN номер обязателен для заполнения';
    }
    if (vin.length !== 17) {
      return 'VIN номер должен содержать ровно 17 символов';
    }
    const invalidChars = /[IOQ]/i;
    if (invalidChars.test(vin)) {
      return 'VIN номер содержит недопустимые символы (I, O, Q)';
    }
    const validPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
    if (!validPattern.test(vin)) {
      return 'VIN номер содержит недопустимые символы';
    }
    return null;
  };

  const handleBrandChange = async (brandId) => {
    try {
      const response = await axios.get(`${API_URL}/api/car-brands/${brandId}/models`);
      setCarModels(response.data);
      setValue('carModelId', ''); // Сбрасываем выбор модели
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error);
    }
  };

const handlePrintQR = () => {
  if (!qr) return;
  
  // Создаем окно только с QR-кодом
  const printWindow = window.open('', '_blank');
  
  // HTML только с QR-кодом (без текста)
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>QR-код</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          background: white; 
        }
        .qr-container { 
          text-align: center; 
        }
        .qr-code { 
          margin: 0 auto; 
        }
        @media print {
          body { padding: 0; margin: 0; }
          .qr-container { 
            width: 100vw; 
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
          }
        }
        @page { 
          margin: 0; 
          size: auto; 
        }
      </style>
    </head>
    <body>
      <div class="qr-container">
        <div class="qr-code">
          <img src="${document.querySelector('#qrcode-section canvas').toDataURL('image/png')}" 
               alt="QR Code" 
               style="width: 200px; height: 200px;">
        </div>
      </div>
      <script>
        window.onload = function() {
          window.focus();
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};

  const handlePrintAct = async () => {
  if (!currentActId) return;
  try {
    // Открываем новое окно с URL печати
    const printWindow = window.open('', '_blank');
    
    // Загружаем HTML контент с авторизацией
    const response = await axios.get(`${API_URL}/vehicle-acts/${currentActId}/print`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Вставляем полученный HTML в новое окно
    printWindow.document.write(response.data);
    printWindow.document.close();
    
    // Автоматическая печать после загрузки
    printWindow.onload = function() {
      printWindow.print();
    };
    
  } catch (error) {
    console.error('Ошибка при печати акта:', error);
    alert('Не удалось загрузить акт для печати');
  }
};

  const checkVinExists = async (vin) => {
    try {
      const response = await axios.get(`${API_URL}/vehicle-acts/check-vin/${encodeURIComponent(vin)}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking VIN:', error);
      return false;
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const renamedFiles = files.map((file, index) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        const extension = file.name.split('.').pop() || 'jpg';
        const newFileName = `TEMP_${timestamp}_${random}_${index + 1}.${extension}`;
        return new File([file], newFileName, { type: file.type });
      });
      setPhotos(prev => [...prev, ...renamedFiles]);
    }
    setIsTakingPhotos(false);
  };

  const handleTakePhotos = () => {
    setIsTakingPhotos(true);
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('multiple', 'true');
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleSelectFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('multiple', 'true');
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (formData) => {
    if (formSubmitted) return;
    
    try {
      const vinValidationError = validateVin(formData.vin);
      if (vinValidationError) {
        alert(vinValidationError);
        return;
      }
      
      const vinExists = await checkVinExists(formData.vin);
      if (vinExists) {
        const shouldContinue = window.confirm(`Акт с VIN "${formData.vin}" уже существует. Создать новый?`);
        if (!shouldContinue) {
          return;
        }
      }
      
      setIsSubmitting(true);
      
      const processedData = {
        date: String(formData.date || new Date().toISOString().split('T')[0]),
        principal: String(formData.principal || ''),
        sender: String(formData.sender || ''),
        directionId: String(formData.directionId || ''),
        transportMethodId: String(formData.transportMethodId || ''),
        vin: String(formData.vin || ''),
        licensePlate: String(formData.licensePlate || ''),
        carBrandId: String(formData.carBrandId || ''),
        carModelId: String(formData.carModelId || ''),
        color: String(formData.color || ''),
        year: parseInt(formData.year || '2020', 10),
        equipment: formData.equipment || {},
        inspectionTime: String(formData.inspection?.time || 'день'),
        externalCondition: String(formData.externalCondition || 'Чистый'),
        interiorCondition: String(formData.interiorCondition || 'Чистый'),
        paintInspectionImpossible: Boolean(formData.paintInspectionImpossible),
        internalContents: String(formData.internalContents || ''),
        fuelLevel: String(formData.fuelLevel || '0%')
      };

      setSubmittedData(processedData);
      setShowTransferDialog(true);
      
    } catch (err) {
      console.error('Error:', err);
      alert('Ошибка при подготовке данных: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferConfirm = async () => {
    if (!submittedData) return;
    
    try {
      setIsSubmitting(true);
      
      const multipartData = new FormData();
      
      multipartData.append('date', submittedData.date);
      multipartData.append('principal', submittedData.principal);
      multipartData.append('sender', submittedData.sender);
      multipartData.append('directionId', submittedData.directionId);
      multipartData.append('transportMethodId', submittedData.transportMethodId);
      multipartData.append('vin', submittedData.vin);
      multipartData.append('licensePlate', submittedData.licensePlate);
      multipartData.append('carBrandId', submittedData.carBrandId);
      multipartData.append('carModelId', submittedData.carModelId);
      multipartData.append('color', submittedData.color);
      multipartData.append('year', submittedData.year.toString());
      multipartData.append('externalCondition', submittedData.externalCondition);
      multipartData.append('paintInspectionImpossible', submittedData.paintInspectionImpossible.toString());
      multipartData.append('internalContents', submittedData.internalContents);
      multipartData.append('fuelLevel', submittedData.fuelLevel);
      multipartData.append('equipment', JSON.stringify(submittedData.equipment));
      multipartData.append('inspectionTime', submittedData.inspectionTime);
      
      photos.forEach((file) => {
        multipartData.append('photos', file);
      });

      const response = await axios.post(`${API_URL}/vehicle-acts`, multipartData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000,
      });
      
      setCurrentActId(response.data.id);
      setShowPrintButtons(true);
      setQr(response.data.id);
      setPhotos([]);
      setShowTransferDialog(false);
      setSubmittedData(null);
      setFormSubmitted(true);
      
    } catch (err) {
      console.error('Full error:', err);
      
      if (err.response?.status === 409) {
        alert(`Ошибка: ${err.response.data?.message || 'Акт с таким VIN уже существует'}`);
      } else if (err.code === 'ECONNREFUSED') {
        alert('Ошибка: Бэкенд сервер не запущен');
      } else if (err.response) {
        alert(`Ошибка сервера: ${err.response.status}`);
      } else if (err.request) {
        alert('Ошибка сети: не удалось подключиться к серверу');
      } else {
        alert('Неизвестная ошибка: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferCancel = () => {
    setShowTransferDialog(false);
    setSubmittedData(null);
  };

  const handleNewInspectionConfirm = () => {
    reset();
    const currentDate = new Date().toISOString().split('T')[0];
    setValue('date', currentDate);
    setQr(null);
    setPhotos([]);
    setSubmittedData(null);
    setFormSubmitted(false);
    setShowNewInspectionDialog(false);
    setVinError(null);
    setShowPrintButtons(false);
    setCurrentActId(null);
  };

  const handleNewInspectionCancel = () => {
    setShowNewInspectionDialog(false);
  };

  const promptNewInspection = () => {
    setShowNewInspectionDialog(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleCreateNew = () => {
    promptNewInspection();
  };

  return (
    <div className="receive-container">
      <div className="receive-header">
        <h1>Акт приёма-передачи ТС</h1>
        <button type="button" onClick={handleBack} className="back-btn">
          Назад
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="receive-form">
        <input type="hidden" {...register('date')} />

        <div className="form-group">
          <input {...register('principal')} placeholder="Принципал/Получатель" className="form-input" disabled={formSubmitted} />
        </div>

        <div className="form-group">
          <input {...register('sender')} placeholder="Отправитель" className="form-input" disabled={formSubmitted} />
        </div>

        <div className="form-group">
          <label>Направление</label>
          <select {...register('directionId')} className="form-select" disabled={formSubmitted}>
            <option value="">Выберите направление</option>
            {directions.map(dir => (
              <option key={dir.id} value={dir.id}>{dir.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Способ перевозки</label>
          <select {...register('transportMethodId')} className="form-select" disabled={formSubmitted}>
            <option value="">Выберите способ перевозки</option>
            {transportMethods.map(method => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input {...register('vin')} placeholder="VIN*" required className="form-input" disabled={formSubmitted} />
          {vinError && <p className="error-text">{vinError}</p>}
        </div>

        <div className="form-group">
          <input {...register('licensePlate')} placeholder="Гос. номер*" required className="form-input" disabled={formSubmitted} />
        </div>

        <div className="form-group">
          <label>Марка*</label>
          <select 
            {...register('carBrandId', { required: true })} 
            onChange={(e) => handleBrandChange(e.target.value)}
            className="form-select"
            disabled={formSubmitted}
          >
            <option value="">Выберите марку</option>
            {carBrands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Модель*</label>
          <select 
            {...register('carModelId', { required: true })} 
            className="form-select"
            disabled={formSubmitted || !carModels.length}
          >
            <option value="">Выберите модель</option>
            {carModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <input {...register('color')} placeholder="Цвет*" required className="form-input" disabled={formSubmitted} />
        </div>

        <div className="form-group">
          <label>Год выпуска*</label>
          <select {...register('year')} className="form-select" defaultValue={YEARS[0]} required disabled={formSubmitted}>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="equipment-section">
          <h3>Комплектность</h3>
          {EQUIPMENT_ITEMS.map(({ key, label, options }) => (
            <div key={key} className="equipment-item">
              <span>{label}</span>
              <select {...register(`equipment.${key}`)} className="form-select" defaultValue="нет" disabled={formSubmitted}>
                {options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Уровень топлива</label>
          <select {...register('fuelLevel')} className="form-select" defaultValue="0%" disabled={formSubmitted}>
            {Array.from({ length: 21 }, (_, i) => i * 5).map((level) => (
              <option key={level} value={`${level}%`}>{level}%</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Условия осмотра</label>
          <select {...register('inspection.time')} className="form-select" defaultValue="день" disabled={formSubmitted}>
            {INSPECTION_TIMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Внешнее состояние а/м</label>
          <select {...register('externalCondition')} className="form-select" defaultValue="Чистый" disabled={formSubmitted}>
            {EXTERNAL_CONDITIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

<div className="form-group">
  <label>Состояние салона автомобиля</label>
  <select {...register('interiorCondition')} className="form-select" defaultValue="Чистый" disabled={formSubmitted}>
    <option value="Чистый">Чистый</option>
    <option value="Грязный">Грязный</option>
    <option value="Поврежден">Поврежден</option>
  </select>
</div>

        <div className="form-group">
          <label>Внутренние вложения</label>
          <textarea {...register('internalContents')} placeholder="Опишите внутренние вложения..." rows={3} className="form-textarea" disabled={formSubmitted} />
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" {...register('paintInspectionImpossible')} disabled={formSubmitted} />
          <span>осмотр ЛКП невозможен</span>
        </div>

        <div className="form-group">
          <label>Фотографии</label>
          <div className="photo-buttons">
            <button type="button" onClick={handleTakePhotos} disabled={isTakingPhotos || formSubmitted} className="photo-btn primary">
              {isTakingPhotos ? 'Съемка...' : 'Сделать фотографии'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={formSubmitted} />
            <button type="button" onClick={handleSelectFromGallery} disabled={formSubmitted} className="photo-btn secondary">
              Выбрать из галереи
            </button>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="photos-preview">
            <div className="photos-header">
              <span>Загружено фотографий: {photos.length}</span>
              <button type="button" onClick={() => setPhotos([])} className="clear-btn">
                Очистить все
              </button>
            </div>
            <div className="photos-grid">
              {photos.map((file, index) => (
                <div key={index} className="photo-item">
                  <img src={URL.createObjectURL(file)} alt={`Фото ${index + 1}`} />
                  <button type="button" onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))} className="remove-btn">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting || formSubmitted || !!vinError} className="submit-btn">
          {isSubmitting ? 'Сохранение...' : 'Сохранить и получить QR'}
        </button>
      </form>

      {/* Диалоговые окна */}
      {showTransferDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Передать данные</h3>
            <p>Вы уверены, что хотите передать данные?</p>
            <div className="dialog-buttons">
              <button type="button" onClick={handleTransferCancel} disabled={isSubmitting} className="dialog-btn cancel">
                Нет
              </button>
              <button type="button" onClick={handleTransferConfirm} disabled={isSubmitting} className="dialog-btn confirm">
                {isSubmitting ? 'Передача...' : 'Да'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewInspectionDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Начать новый осмотр</h3>
            <p>Вы уверены, что хотите начать новый осмотр?</p>
            <div className="dialog-buttons">
              <button type="button" onClick={handleNewInspectionCancel} className="dialog-btn cancel">
                Нет
              </button>
              <button type="button" onClick={handleNewInspectionConfirm} className="dialog-btn confirm">
                Да
              </button>
            </div>
          </div>
        </div>
      )}

      {qr && (
        <div className="qr-section" id="qrcode-section">
          <div className="success-message">
            <h3>Акт успешно создан!</h3>
            <p>ID: {qr}</p>
          </div>
          
          <QRCodeCanvas value={`${API_URL}/vehicle-acts/${qr}`} size={200} />
          
          {showPrintButtons && (
            <div className="print-buttons">
              <button type="button" onClick={handlePrintQR} className="print-btn">
                Распечатать QR код
              </button>
              <button type="button" onClick={handlePrintAct} className="print-btn">
                Распечатать акт
              </button>
            </div>
          )}
          
          <div className="qr-buttons">
            <button type="button" onClick={handleCreateNew} className="qr-btn">
              Создать новый осмотр
            </button>
            <button type="button" onClick={handleBack} className="qr-btn">
              Назад
            </button>
          </div>
        </div>
      )}
    </div>
  );
}