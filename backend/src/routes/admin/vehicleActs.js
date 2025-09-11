import express from 'express';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';
import { requireAdminOrManager } from '../../middleware/admin-auth.js';
import { vehicleActAdminController } from '../../controllers/admin/VehicleActAdminController.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора/менеджера
router.use(authenticateToken);
router.use(requireAdminOrManager);

// GET /api/admin/vehicle-acts - Получить список актов с пагинацией
router.get('/', vehicleActAdminController.getVehicleActs);

// GET /api/admin/vehicle-acts/:id - Получить акт по ID
router.get('/:id', vehicleActAdminController.getVehicleAct);

// PUT /api/admin/vehicle-acts/:id - Обновить акт
router.put('/:id', vehicleActAdminController.updateVehicleAct);

// DELETE /api/admin/vehicle-acts/:id - Удалить акт
router.delete('/:id', vehicleActAdminController.deleteVehicleAct);

export default router;