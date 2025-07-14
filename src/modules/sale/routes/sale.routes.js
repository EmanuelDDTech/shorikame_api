import { Router } from 'express';
import authMiddleware from '#middleware/authMiddleware.js';
import {
  createOrder,
  getOrderById,
  getOrders,
  getOrdersAdmin,
  salesByDay,
  salesByMonth,
  salesByWeek,
  salesByYear,
  updateOrder,
} from '#modules/sale/controllers/sale.controller.js';

const router = Router();

router.route('/').get(authMiddleware, getOrders).post(authMiddleware, createOrder);
router.route('/admin').get(authMiddleware, getOrdersAdmin);

router.route('/:id').get(authMiddleware, getOrderById).put(authMiddleware, updateOrder);

router.route('/admin/byYear').get(authMiddleware, salesByYear);
router.route('/admin/byMonth').get(authMiddleware, salesByMonth);
router.route('/admin/byWeek').get(authMiddleware, salesByWeek);
router.route('/admin/byDay').get(authMiddleware, salesByDay);

export default router;
