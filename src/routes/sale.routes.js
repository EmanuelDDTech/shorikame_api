import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from '../controllers/sale.controller.js';

const router = Router();

router.route('/').get(authMiddleware, getOrders).post(authMiddleware, createOrder);
router.route('/:id').get(authMiddleware, getOrderById).put(authMiddleware, updateOrder);

export default router;
