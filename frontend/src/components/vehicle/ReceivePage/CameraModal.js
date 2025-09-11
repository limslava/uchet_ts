import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../common/Button/Button';
import './CameraModal.css';

export const CameraModal = ({ onClose, onPhotosTaken }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [facingMode, setFacingMode] = useState('environment');

  // Инициализация камеры
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      // Освобождаем URL объектов для предотвращения утечек памяти
      capturedPhotos.forEach(photo => {
        URL.revokeObjectURL(photo.url);
      });
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera(); // Останавливаем предыдущий поток
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      alert('Не удалось получить доступ к камере');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop(); // Явно останавливаем каждый трек
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || !stream) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Для задней камеры не отражаем изображение
    if (facingMode === 'environment') {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else {
      // Для фронтальной камеры отражаем изображение
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    canvas.toBlob(blob => {
      const fileName = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      setCapturedPhotos(prev => [...prev, {
        file,
        url: URL.createObjectURL(blob)
      }]);
    }, 'image/jpeg', 0.9);
  };

  const switchCamera = async () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const removePhoto = (index) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].url); // Освобождаем URL
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const confirmPhotos = () => {
    onPhotosTaken(capturedPhotos.map(item => item.file));
    stopCamera(); // Останавливаем камеру перед закрытием
    onClose();
  };

  const handleClose = () => {
    stopCamera(); // Останавливаем камеру перед закрытием
    onClose();
  };

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <h3>Съемка фотографий</h3>
          <Button variant="primary" onClick={confirmPhotos}>Готово ({capturedPhotos.length})</Button>
        </div>

        <div className="camera-preview">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
            style={{ transform: facingMode === 'environment' ? 'none' : 'scaleX(-1)' }}
          />
          
          <div className="captured-photos-preview">
            {capturedPhotos.map((photo, index) => (
              <div key={index} className="captured-photo-item">
                <img src={photo.url} alt={`Фото ${index + 1}`} />
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => removePhoto(index)}
                  className="remove-photo-btn"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="camera-controls">
          <Button variant="secondary" onClick={switchCamera}>
            {facingMode === 'environment' ? 'Фронтальная' : 'Тыльная'}
          </Button>
          
          <Button
            variant="primary"
            onClick={takePhoto}
            className="shutter-button"
          >
            📸
          </Button>
          
          <div className="photo-counter">
            {capturedPhotos.length} фото
          </div>
        </div>
      </div>
    </div>
  );
};