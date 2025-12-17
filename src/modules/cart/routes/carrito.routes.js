import { Router } from 'express';
import {
  addProduct,
  deleteProduct,
  getCart,
  updateProduct,
} from '#modules/cart/controllers/carrito.controller.js';
import authMiddleware from '#src/middleware/authMiddleware';

const router = Router();

router
  .route('/')
  .get(authMiddleware, getCart)
  .post(authMiddleware, addProduct)
  .put(authMiddleware, updateProduct);

router.route('/:productId').delete(authMiddleware, deleteProduct);

export default router;
