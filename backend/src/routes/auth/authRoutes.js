import express from 'express';
import { authController } from '../../controllers/auth/authController.js';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/login', authController.getLoginInfo);
router.post('/login', authController.login);

// Protected routes
router.post('/:userId/location', authenticateToken, authController.selectLocation);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;