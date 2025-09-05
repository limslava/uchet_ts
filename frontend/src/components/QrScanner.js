import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const QrScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 }
      // Убрали supportedScanTypes - используем значения по умолчанию
    });

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (error) => {
        // Игнорируем ошибки "QR code not found" - это нормально при сканировании
        if (!error.message.includes('No MultiFormat Readers')) {
          onScanError(error);
        }
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="qr-scanner">
      <div id="qr-reader" className="qr-reader"></div>
    </div>
  );
};

export default QrScanner;