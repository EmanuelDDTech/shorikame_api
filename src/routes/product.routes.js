import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').get(getProductById).delete(deleteProduct).put(updateProduct);
router.route('/buscar').get(searchProducts);

export default router;
