import express from 'express';
import { vehicleActController } from '../../controllers/vehicle/vehicleActController.js';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Все routes требуют аутентификации
router.use(authenticateToken);

// Создание акта с загрузкой файлов
router.post('/', 
  vehicleActController.uploadMiddleware,
  vehicleActController.createVehicleAct
);

// Получение актов
router.get('/', vehicleActController.getAllVehicleActs);
router.get('/:id', vehicleActController.getVehicleActById);

// Дополнительные endpoints
router.get('/check-vin/:vin', vehicleActController.checkVin);
router.post('/:id/receive', vehicleActController.confirmReceipt);
router.get('/:id/export-docx', vehicleActController.exportToDocx);
router.get('/:id/print', vehicleActController.printHtml);

export default router;