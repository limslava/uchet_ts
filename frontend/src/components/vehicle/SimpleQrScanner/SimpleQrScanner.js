import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './SimpleQrScanner.css';

const SimpleQrScanner = ({ onScanSuccess, onClose }) => {
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Получаем список камер
    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        setAvailableCameras(cameras);
        
        // Пытаемся найти заднюю камеру
        const rearCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        );
        
        if (rearCamera) {
          setSelectedCamera(rearCamera.id);
          startScanner(rearCamera.id);
        } else {
          setSelectedCamera(cameras[0].id);
          startScanner(cameras[0].id);
        }
      }
    }).catch(err => {
      console.error("Не удалось получить список камер:", err);
    });

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async (cameraId) => {
    try {
      if (html5QrCodeRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode("simple-qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (error) => {
          // Игнорируем некоторые ошибки
          if (error && error.message && !error.message.includes('No MultiFormat Readers')) {
            console.error("Ошибка сканирования:", error);
          }
        }
      );
    } catch (error) {
      console.error("Ошибка запуска сканера:", error);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      }
    } catch (error) {
      console.error("Ошибка остановки сканера:", error);
    }
  };

  const handleCameraChange = (e) => {
    const cameraId = e.target.value;
    setSelectedCamera(cameraId);
    startScanner(cameraId);
  };

  return (
    <div className="simple-qr-scanner">
      <div className="scanner-header">
        <h3>Сканирование ТС</h3>
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      </div>
      
      <div id="simple-qr-reader" className="simple-qr-reader"></div>
      
      <div className="scanner-controls">
        {availableCameras.length > 1 && (
          <select 
            value={selectedCamera} 
            onChange={handleCameraChange}
            className="camera-select"
          >
            {availableCameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        )}
        
        <button onClick={onClose} className="btn btn-secondary">
          Закрыть сканер
        </button>
      </div>
    </div>
  );
};

export default SimpleQrScanner;