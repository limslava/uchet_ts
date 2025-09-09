import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import './QrScanner.css';

const QrScanner = ({ onScanSuccess, onScanError, showCameraSelection = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [showCameraSelectionUI, setShowCameraSelectionUI] = useState(showCameraSelection);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    Html5Qrcode.getCameras().then(cameras => {
      if (cameras && cameras.length) {
        setAvailableCameras(cameras);
        
        const rearCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        );
        
        if (rearCamera) {
          setSelectedCamera(rearCamera.id);
        } else {
          setSelectedCamera(cameras[0].id);
        }
      }
    }).catch(err => {
      console.error("Не удалось получить список камер:", err);
      onScanError(err);
    });

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      if (!selectedCamera) {
        throw new Error('Камера не выбрана');
      }

      if (html5QrCodeRef.current && isScanning) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 300, height: 300 }
        },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (error) => {
          if (error && error.message && !error.message.includes('No MultiFormat Readers')) {
            onScanError(error);
          }
        }
      );

      setIsScanning(true);
      setShowCameraSelectionUI(false);
    } catch (error) {
      console.error("Ошибка запуска сканера:", error);
      onScanError(error);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      }
      setIsScanning(false);
      setShowCameraSelectionUI(false);
    } catch (error) {
      console.error("Ошибка остановки сканера:", error);
      onScanError(error);
    }
  };

  const handleCameraButtonClick = () => {
    setShowCameraSelectionUI(true);
  };

  const scanFromFile = () => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        html5QrCode.scanFile(file, false)
          .then(decodedText => {
            onScanSuccess(decodedText);
            html5QrCode.clear();
          })
          .catch(error => {
            if (error && error.message) {
              onScanError(error);
            }
            html5QrCode.clear();
          });
      }
    };
    input.click();
  };

  return (
    <div className="qr-scanner">
      <div id="qr-reader" className="qr-reader"></div>
      
      <div className="scanner-controls">
        {/* Если showCameraSelection=true, сразу показываем интерфейс выбора камеры */}
        {showCameraSelection && !isScanning && availableCameras.length > 0 && (
          <>
            <select 
              value={selectedCamera} 
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="camera-select"
            >
              {availableCameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))}
            </select>
            <button onClick={startScanner} className="scanner-btn start-btn">
              Начать сканирование
            </button>
            <button onClick={() => window.history.back()} className="scanner-btn back-btn">
              Назад
            </button>
          </>
        )}
        
        {!showCameraSelection && !isScanning && (
          // Стандартное поведение (показываем меню с кнопками)
          <>
            {!showCameraSelectionUI && (
              <>
                <button onClick={handleCameraButtonClick} className="scanner-btn camera-btn">
                  Камера
                </button>
                <button onClick={scanFromFile} className="scanner-btn gallery-btn">
                  Галерея
                </button>
              </>
            )}
            
            {showCameraSelectionUI && (
              <>
                {availableCameras.length > 0 && (
                  <select 
                    value={selectedCamera} 
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="camera-select"
                  >
                    {availableCameras.map(camera => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label}
                      </option>
                    ))}
                  </select>
                )}
                <button onClick={startScanner} className="scanner-btn start-btn">
                  Начать сканирование
                </button>
                <button onClick={() => setShowCameraSelectionUI(false)} className="scanner-btn back-btn">
                  Назад
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Отдельный контейнер для кнопки остановки, который всегда виден поверх камеры */}
      {isScanning && (
        <div className="stop-button-container">
          <button onClick={stopScanner} className="scanner-btn stop-btn">
            Остановить сканирование
          </button>
        </div>
      )}
    </div>
  );
};

export default QrScanner;