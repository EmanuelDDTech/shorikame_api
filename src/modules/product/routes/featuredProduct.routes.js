import { Router } from 'express';
import {
  createFeaturedProduct,
  deleteFeaturedProduct,
  getFeaturedProductAll,
  updateFeaturedProduct,
} from '#modules/product/controllers/featuredProduct.controller.js';
import authMiddleware from '#src/middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getFeaturedProductAll).post(authMiddleware, createFeaturedProduct);

router
  .route('/:featured_id')
  .delete(authMiddleware, deleteFeaturedProduct)
  .put(authMiddleware, updateFeaturedProduct);

export default router;
