import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from '#modules/product/controllers/product.controller.js';
import authMiddleware from '#src/middleware/authMiddleware';

const router = Router();

router.route('/products').get(getProducts).post(createProduct);
router
  .route('/products/:id')
  .get(getProductById)
  .delete(deleteProduct)
  .put(authMiddleware, updateProduct);
router.route('/buscar').get(searchProducts);

export default router;
