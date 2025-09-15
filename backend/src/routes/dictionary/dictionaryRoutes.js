import express from 'express';
import { dictionaryController } from '../../controllers/dictionary/dictionaryController.js';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/containers', dictionaryController.getContainers);
router.get('/car-brands', dictionaryController.getCarBrands);
router.get('/car-brands/:brandId/models', dictionaryController.getCarModelsByBrand);
router.get('/directions', dictionaryController.getDirections);
router.get('/transport-methods', dictionaryController.getTransportMethods);

export default router;