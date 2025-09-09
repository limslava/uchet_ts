import express from 'express';
import { authenticateToken } from '../../middleware/auth/authMiddleware.js';
import { requireAdmin } from '../../middleware/admin-auth.js';
import { userAdminController } from '../../controllers/admin/UserAdminController.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Получить список пользователей
router.get('/', userAdminController.getUsers);

// POST /api/admin/users - Создать пользователя
router.post('/', userAdminController.createUser);

// PUT /api/admin/users/:id - Обновить пользователя
router.put('/:id', userAdminController.updateUser);

// DELETE /api/admin/users/:id - Удалить пользователя
router.delete('/:id', userAdminController.deleteUser);

// POST /api/admin/users/:id/reset-password - Сбросить пароль
router.post('/:id/reset-password', userAdminController.resetPassword);

export default router;