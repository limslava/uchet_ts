import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const API_URL = 'http://localhost:5000';

const EQUIPMENT_ITEMS = [
  { key: 'wipers', label: 'Щетки стеклоочистителя', options: ['нет', '1', '2', '3'] },
  { key: 'fogLights', label: 'Противотуманные фары', options: ['нет', '1', '2'] },
  // ... остальные элементы комплектации из вашего кода
];

export default function ReceivePage() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [photos, setPhotos] = useState([]);
  const [token, setToken] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (formData) => {
    if (!token) {
      alert('Нет токена авторизации');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Добавляем текстовые поля
      Object.keys(formData).forEach(key => {
        if (key !== 'equipment' && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Добавляем equipment как JSON строку
      if (formData.equipment) {
        formDataToSend.append('equipment', JSON.stringify(formData.equipment));
      }
      
      // Добавляем фото
      photos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });

      const response = await axios.post(`${API_URL}/vehicle-acts`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setQrCode(response.data.id);
      alert('Акт успешно создан!');
      
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при создании акта: ' + error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Приёмка транспортного средства</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Основные поля */}
        <div style={{ marginBottom: '15px' }}>
          <label>VIN:</label>
          <input {...register('vin')} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Гос. номер:</label>
          <input {...register('licensePlate')} required style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Кнопка отправки */}
        <button 
          type="submit" 
          disabled={isSubmitting || !token}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isSubmitting ? 'Сохранение...' : 'Создать акт'}
        </button>
      </form>

      {qrCode && (
        <div style={{ marginTop: '20px' }}>
          <h3>QR-код акта:</h3>
          <QRCodeCanvas value={qrCode} size={200} />
        </div>
      )}
    </div>
  );
}