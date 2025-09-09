import express from 'express';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';
import { requireAdminOrManager } from '../../middleware/admin-auth.js';
import { analyticsAdminController } from '../../controllers/admin/AnalyticsAdminController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdminOrManager);

router.get('/stats', analyticsAdminController.getDashboardStats);

export default router;