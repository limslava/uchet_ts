import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button/Button';
import { PhotoUploader } from './PhotoUploader';
import { EquipmentSection } from './EquipmentSection';
import { TransferDialog } from './TransferDialog';
import { NewInspectionDialog } from './NewInspectionDialog';
import { QrSection } from './QrSection';
import './ReceivePage.css';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://192.168.0.121:5000';
const YEARS = Array.from({ length: 60 }, (_, i) => (new Date().getFullYear() - i).toString());

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
  const [validationErrors, setValidationErrors] = useState({});
  const currentVin = watch('vin');
  

  useEffect(() => {
    console.log('Validation errors:', validationErrors);
  }, [validationErrors]);

  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'receiver@example.com',
            password: 'password123'
          }),
        });

        if (!response.ok) {
          throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error('Ошибка авторизации:', error);
        alert('Ошибка авторизации');
      }
    };
    login();
  }, []);

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        console.log('Загрузка справочников...');
        
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const [dirsResponse, methodsResponse, brandsResponse] = await Promise.all([
  fetch(`${API_URL}/api/dictionaries/directions`, { headers }),
  fetch(`${API_URL}/api/dictionaries/transport-methods`, { headers }),
  fetch(`${API_URL}/api/dictionaries/car-brands`, { headers }) // ИЗМЕНЕНО
]);

        if (!dirsResponse.ok || !methodsResponse.ok || !brandsResponse.ok) {
          throw new Error('Ошибка загрузки справочников');
        }

        const directionsData = await dirsResponse.json();
        const methodsData = await methodsResponse.json();
        const brandsData = await brandsResponse.json();
        
        console.log('Направления:', directionsData);
        console.log('Способы перевозки:', methodsData);
        console.log('Марки:', brandsData);
        
        setDirections(directionsData);
        setTransportMethods(methodsData);
        setCarBrands(brandsData);
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };
    
    if (token) {
      loadDictionaries();
    }
  }, [token]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setValue('date', currentDate);
  }, [setValue]);

  useEffect(() => {
    if (currentVin) {
      const error = validateVin(currentVin);
      setVinError(error);
    } else {
      setVinError(null);
    }
  }, [currentVin]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('Form values changed:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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

  const validateForm = (formData) => {
    console.log('Validating form data:', formData);
    const errors = {};

    if (!formData.carBrandId) errors.carBrandId = 'Выберите марку автомобиля';
    if (!formData.carModelId) errors.carModelId = 'Выберите модель автомобиля';

    if (!formData.licensePlate?.trim()) errors.licensePlate = 'Гос. номер обязателен';
    if (!formData.color?.trim()) errors.color = 'Цвет обязателен';

    return errors;
  };

  const handleBrandChange = async (brandId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dictionaries/car-brands/${brandId}/models`, { // 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки моделей');
      }

      const modelsData = await response.json();
      setCarModels(modelsData);
      
      setValue('carBrandId', brandId, { shouldValidate: true, shouldDirty: true });
      setValue('carModelId', '');
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.carBrandId;
        return newErrors;
      });
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error);
    }
  };

  const handlePrintQR = () => {
    if (!qr) return;
    
    const printWindow = window.open('', '_blank');
    
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
      const printWindow = window.open('', '_blank');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/vehicle-acts/${currentActId}/print`, { //- меняли
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки акта');
      }

      const htmlContent = await response.text();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
      };
      
    } catch (error) {
      console.error('Ошибка при печати акта:', error);
      alert('Не удалось загрузить акт для печати');
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
      if (!token) {
        alert('Ошибка авторизации. Перезагрузите страницу.');
        return;
      }

      const vinValidationError = validateVin(formData.vin);
      if (vinValidationError) {
        setVinError(vinValidationError);
        document.querySelector('[name="vin"]')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        return;
      }

      const formErrors = validateForm(formData);
      if (Object.keys(formErrors).length > 0) {
        setValidationErrors(formErrors);
        const firstErrorField = Object.keys(formErrors)[0];
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        return;
      }

      setValidationErrors({});
      
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

      console.log('Processed data for submission:', processedData);

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
  
  const formErrors = validateForm(submittedData);
  if (Object.keys(formErrors).length > 0) {
    setValidationErrors(formErrors);
    setShowTransferDialog(false);
    return;
  }
  
  try {
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
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
    multipartData.append('interiorCondition', submittedData.interiorCondition);
    multipartData.append('paintInspectionImpossible', submittedData.paintInspectionImpossible.toString());
    multipartData.append('internalContents', submittedData.internalContents);
    multipartData.append('fuelLevel', submittedData.fuelLevel);
    multipartData.append('equipment', JSON.stringify(submittedData.equipment));
    multipartData.append('inspectionTime', submittedData.inspectionTime);
    
    photos.forEach((file) => {
      multipartData.append('photos', file);
    });

    // Создаем акт
    const response = await fetch(`${API_URL}/vehicle-acts`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: multipartData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Сессия истекла');
    }

    if (!response.ok) {
      throw new Error('Ошибка создания акта');
    }

    const responseData = await response.json();
    setCurrentActId(responseData.id);
    
    // Автоматически подтверждаем прием ТС
    const receiveResponse = await fetch(`${API_URL}/vehicle-acts/${responseData.id}/receive`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!receiveResponse.ok) {
      console.error('Ошибка подтверждения приема ТС');
    }

    setShowPrintButtons(true);
    setQr(responseData.id);
    setPhotos([]);
    setShowTransferDialog(false);
    setSubmittedData(null);
    setFormSubmitted(true);
    setValidationErrors({});
    
  } catch (err) {
    console.error('Full error:', err);
    
    if (err.message === 'Сессия истекла') {
      alert('Сессия истекла. Пожалуйста, войдите снова.');
    } else if (err.message.includes('Failed to fetch')) {
      alert('Ошибка: Бэкенд сервер не запущен');
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
    setValidationErrors({});
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

  const handleInputChange = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return (
    <div className="receive-container">
      <div className="receive-header">
        <h1>Акт приёма-передачи ТС</h1>
        <Button type="button" onClick={handleBack} variant="secondary">
          Назад
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="receive-form">
        <input type="hidden" {...register('date')} />

        <div className="form-group">
          <input 
            {...register('principal')} 
            placeholder="Принципал/Получатель" 
            className={`form-input ${validationErrors.principal ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('principal').onChange;
              onChange(e);
              handleInputChange('principal');
            }}
          />
          {validationErrors.principal && <p className="error-text">{validationErrors.principal}</p>}
        </div>

        <div className="form-group">
          <input 
            {...register('sender')} 
            placeholder="Отправитель" 
            className={`form-input ${validationErrors.sender ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('sender').onChange;
              onChange(e);
              handleInputChange('sender');
            }}
          />
          {validationErrors.sender && <p className="error-text">{validationErrors.sender}</p>}
        </div>

        <div className="form-group">
          <label>Направление</label>
          <select 
            {...register('directionId')} 
            className={`form-select ${validationErrors.directionId ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('directionId').onChange;
              onChange(e);
              handleInputChange('directionId');
            }}
          >
            <option value="">Выберите направление</option>
            {directions.map(dir => (
              <option key={dir.id} value={dir.id}>{dir.name}</option>
            ))}
          </select>
          {validationErrors.directionId && <p className="error-text">{validationErrors.directionId}</p>}
        </div>

        <div className="form-group">
          <label>Способ перевозки</label>
          <select 
            {...register('transportMethodId')} 
            className={`form-select ${validationErrors.transportMethodId ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('transportMethodId').onChange;
              onChange(e);
              handleInputChange('transportMethodId');
            }}
          >
            <option value="">Выберите способ перевозки</option>
            {transportMethods.map(method => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
          </select>
          {validationErrors.transportMethodId && <p className="error-text">{validationErrors.transportMethodId}</p>}
        </div>

        <div className="form-group">
          <input 
            {...register('vin')} 
            placeholder="VIN*" 
            required 
            className={`form-input ${vinError ? 'error' : ''}`} 
            disabled={formSubmitted}
          />
          {vinError && <p className="error-text">{vinError}</p>}
        </div>

        <div className="form-group">
          <input 
            {...register('licensePlate')} 
            placeholder="Гос. номер*" 
            required 
            className={`form-input ${validationErrors.licensePlate ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('licensePlate').onChange;
              onChange(e);
              handleInputChange('licensePlate');
            }}
          />
          {validationErrors.licensePlate && <p className="error-text">{validationErrors.licensePlate}</p>}
        </div>

        <div className="form-group">
          <label>Марка*</label>
          <select 
            {...register('carBrandId', { 
              required: true,
              onChange: (e) => {
                const brandId = e.target.value;
                if (brandId) {
                  handleBrandChange(brandId);
                }
              }
            })} 
            className={`form-select ${validationErrors.carBrandId ? 'error' : ''}`}
            disabled={formSubmitted}
          >
            <option value="">Выберите марку</option>
            {carBrands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          {validationErrors.carBrandId && <p className="error-text">{validationErrors.carBrandId}</p>}
        </div>

        <div className="form-group">
          <label>Модель*</label>
          <select 
            {...register('carModelId', { required: true })}
            className={`form-select ${validationErrors.carModelId ? 'error' : ''}`}
            disabled={formSubmitted || !carModels.length}
            onChange={(e) => {
              const onChange = register('carModelId').onChange;
              onChange(e);
              handleInputChange('carModelId');
            }}
          >
            <option value="">Выберите модель</option>
            {carModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          {validationErrors.carModelId && <p className="error-text">{validationErrors.carModelId}</p>}
        </div>

        <div className="form-group">
          <input 
            {...register('color')} 
            placeholder="Цвет*" 
            required 
            className={`form-input ${validationErrors.color ? 'error' : ''}`} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('color').onChange;
              onChange(e);
              handleInputChange('color');
            }}
          />
          {validationErrors.color && <p className="error-text">{validationErrors.color}</p>}
        </div>

        <div className="form-group">
          <label>Год выпуска*</label>
          <select 
            {...register('year')} 
            className="form-select" 
            defaultValue={YEARS[0]} 
            required 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('year').onChange;
              onChange(e);
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <EquipmentSection register={register} disabled={formSubmitted} />

        <div className="form-group">
          <label>Уровень топлива</label>
          <select 
            {...register('fuelLevel')} 
            className="form-select" 
            defaultValue="0%" 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('fuelLevel').onChange;
              onChange(e);
            }}
          >
            {Array.from({ length: 21 }, (_, i) => i * 5).map((level) => (
              <option key={level} value={`${level}%`}>{level}%</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Условия осмотра</label>
          <select 
            {...register('inspection.time')} 
            className="form-select" 
            defaultValue="день" 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('inspection.time').onChange;
              onChange(e);
            }}
          >
            {INSPECTION_TIMES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Внешнее состояние а/м</label>
          <select 
            {...register('externalCondition')} 
            className="form-select" 
            defaultValue="Чистый" 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('externalCondition').onChange;
              onChange(e);
            }}
          >
            {EXTERNAL_CONDITIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Состояние салона автомобиля</label>
          <select 
            {...register('interiorCondition')} 
            className="form-select" 
            defaultValue="Чистый" 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('interiorCondition').onChange;
              onChange(e);
              console.log('Interior condition changed to:', e.target.value);
            }}
          >
            <option value="Чистый">Чистый</option>
            <option value="Грязный">Грязный</option>
            <option value="Поврежден">Поврежден</option>
          </select>
        </div>

        <div className="form-group">
          <label>Внутренние вложения</label>
          <textarea 
            {...register('internalContents')} 
            placeholder="Опишите внутренние вложения..." 
            rows={3} 
            className="form-textarea" 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('internalContents').onChange;
              onChange(e);
            }}
          />
        </div>

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            {...register('paintInspectionImpossible')} 
            disabled={formSubmitted}
            onChange={(e) => {
              const onChange = register('paintInspectionImpossible').onChange;
              onChange(e);
            }}
          />
          <span>осмотр ЛКП невозможен</span>
        </div>

        <PhotoUploader
          photos={photos}
          setPhotos={setPhotos}
          isTakingPhotos={isTakingPhotos}
          setIsTakingPhotos={setIsTakingPhotos}
          fileInputRef={fileInputRef}
          disabled={formSubmitted}
          handleSelectFromGallery={handleSelectFromGallery}
          handleFileChange={handleFileChange}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting || formSubmitted || !!vinError || Object.keys(validationErrors).length > 0}
          variant="primary"
          className="submit-btn"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить и получить QR'}
        </Button>
      </form>

      <TransferDialog
        isOpen={showTransferDialog}
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
        isSubmitting={isSubmitting}
      />

      <NewInspectionDialog
        isOpen={showNewInspectionDialog}
        onConfirm={handleNewInspectionConfirm}
        onCancel={handleNewInspectionCancel}
      />

      <QrSection
        qr={qr}
        showPrintButtons={showPrintButtons}
        onPrintQr={handlePrintQR}
        onPrintAct={handlePrintAct}
        onCreateNew={handleCreateNew}
        onBack={handleBack}
        apiUrl={API_URL}
      />
    </div>
  );
}