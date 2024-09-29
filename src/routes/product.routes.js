import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js';

const router = Router();

router.route('/products').get(getProducts).post(createProduct);

router.route('/products/:id').get(getProductById).delete(deleteProduct).put(updateProduct);

export default router;
