import express from 'express';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';
import { requireAdmin } from '../../middleware/admin-auth.js';
import { settingsAdminController } from '../../controllers/admin/SettingsAdminController.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', settingsAdminController.getSettings);

export default router;