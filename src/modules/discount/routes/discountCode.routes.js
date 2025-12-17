import { Router } from 'express';
import authMiddleware from '#src/middleware/authMiddleware';
import {
  createDiscountCode,
  deleteDiscountCode,
  getDiscountCodeByCode,
  getDiscountCodeById,
  getDiscountCodes,
  updateDiscountCode,
  updateTimesUsed,
} from '#modules/discount/controllers/discountCode.controller.js';

const router = Router();

router
  .route('/admin')
  .post(authMiddleware, createDiscountCode)
  .get(authMiddleware, getDiscountCodes);
router
  .route('/admin/:id')
  .get(authMiddleware, getDiscountCodeById)
  .put(authMiddleware, updateDiscountCode)
  .delete(authMiddleware, deleteDiscountCode);

router.route('/:code').get(getDiscountCodeByCode).put(updateTimesUsed);

export default router;
