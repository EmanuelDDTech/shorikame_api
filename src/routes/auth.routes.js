import { Router } from 'express';
import {
  register,
  verifyAccount,
  deleteUser,
  sendUser,
  updateUser,
  login,
  sendAdmin,
  googleLogin,
} from '../controllers/auth.controllers.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/registrar', register);
router.get('/verificar/:token', verifyAccount);
router.post('/login', login);
router.post('/google', googleLogin);

// Area Privada - Requiere un JWT
router.get('/user', authMiddleware, sendUser);
router.get('/admin', authMiddleware, sendAdmin);

// router.route('/users/:id').get(getUserById).delete(deleteUser).put(updateUser);

export default router;
