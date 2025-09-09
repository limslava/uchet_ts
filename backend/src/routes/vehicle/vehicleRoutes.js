import express from 'express';
import { vehicleController } from '../../controllers/vehicle/vehicleController.js';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Все routes требуют аутентификации
router.use(authenticateToken);

// Получение всех транспортных средств
router.get('/', vehicleController.getAllVehicles);

// Создание нового транспортного средства
router.post('/', vehicleController.createVehicle);

// Поиск по VIN
router.get('/vin/:vin', vehicleController.getVehicleByVin);

export default router;