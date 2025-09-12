import express from 'express';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';
import { requireAdminOrManager } from '../../middleware/admin-auth.js';
import { dictionaryAdminController } from '../../controllers/admin/DictionaryAdminController.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора/менеджера
router.use(authenticateToken);
router.use(requireAdminOrManager);

// === МАРКИ АВТОМОБИЛЕЙ ===
router.get('/car-brands', dictionaryAdminController.getCarBrands);
router.post('/car-brands', dictionaryAdminController.createCarBrand);
router.put('/car-brands/:id', dictionaryAdminController.updateCarBrand);
router.delete('/car-brands/:id', dictionaryAdminController.deleteCarBrand);

// === МОДЕЛИ АВТОМОБИЛЕЙ ===
router.get('/car-models', dictionaryAdminController.getCarModels);
router.post('/car-models', dictionaryAdminController.createCarModel);
router.put('/car-models/:id', dictionaryAdminController.updateCarModel);
router.delete('/car-models/:id', dictionaryAdminController.deleteCarModel);

// === НАПРАВЛЕНИЯ ПЕРЕВОЗОК ===
router.get('/directions', dictionaryAdminController.getDirections);
router.post('/directions', dictionaryAdminController.createDirection);
router.put('/directions/:id', dictionaryAdminController.updateDirection);
router.delete('/directions/:id', dictionaryAdminController.deleteDirection);

// === СПОСОБЫ ПЕРЕВОЗКИ ===
router.get('/transport-methods', dictionaryAdminController.getTransportMethods);
router.post('/transport-methods', dictionaryAdminController.createTransportMethod);
router.put('/transport-methods/:id', dictionaryAdminController.updateTransportMethod);
router.delete('/transport-methods/:id', dictionaryAdminController.deleteTransportMethod);

// === ЛОКАЦИИ ===
router.get('/locations', dictionaryAdminController.getLocations);
router.post('/locations', dictionaryAdminController.createLocation);
router.put('/locations/:id', dictionaryAdminController.updateLocation);
router.delete('/locations/:id', dictionaryAdminController.deleteLocation);

// Водители
router.get('/drivers', dictionaryAdminController.getDrivers);
router.post('/drivers', dictionaryAdminController.createDriver);
router.put('/drivers/:id', dictionaryAdminController.updateDriver);
router.delete('/drivers/:id', dictionaryAdminController.deleteDriver);

// Транспортные средства перевозчиков
router.get('/company-vehicles', dictionaryAdminController.getCompanyVehicles);
router.post('/company-vehicles', dictionaryAdminController.createCompanyVehicle);
router.put('/company-vehicles/:id', dictionaryAdminController.updateCompanyVehicle);
router.delete('/company-vehicles/:id', dictionaryAdminController.deleteCompanyVehicle);

// Контейнеры
router.get('/containers', dictionaryAdminController.getContainers);
router.post('/containers', dictionaryAdminController.createContainer);
router.put('/containers/:id', dictionaryAdminController.updateContainer);
router.delete('/containers/:id', dictionaryAdminController.deleteContainer);

export default router;