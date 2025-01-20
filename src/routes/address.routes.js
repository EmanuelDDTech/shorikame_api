import { Router } from 'express';
import {
  createAddress,
  deleteAddress,
  getAddressAll,
  getAddressOne,
  updateAddress,
} from '../controllers/address.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(authMiddleware, createAddress).get(authMiddleware, getAddressAll);
router
  .route('/:id')
  .get(authMiddleware, getAddressOne)
  .put(authMiddleware, updateAddress)
  .delete(authMiddleware, deleteAddress);

export default router;
