import { Router } from 'express';
import authMiddleware from '#middleware/authMiddleware.js';
import { getUserById, getUsers } from '#modules/user/controllers/user.controller.js';

const router = Router();

router.route('/').get(authMiddleware, getUsers);
router.route('/:userId').get(authMiddleware, getUserById);

export default router;
