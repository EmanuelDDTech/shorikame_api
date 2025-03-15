import { Router } from 'express';
import {
  createFeaturedProduct,
  deleteFeaturedProduct,
  getFeaturedProductAll,
  updateFeaturedProduct,
} from '../controllers/featuredProduct.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getFeaturedProductAll).post(authMiddleware, createFeaturedProduct);

router
  .route('/:featured_id')
  .delete(authMiddleware, deleteFeaturedProduct)
  .put(authMiddleware, updateFeaturedProduct);

export default router;
