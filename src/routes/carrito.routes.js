import { Router } from 'express';
import {
  addProduct,
  deleteProduct,
  getCart,
  updateProduct,
} from '../controllers/carrito.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router
  .route('/')
  .get(authMiddleware, getCart)
  .post(authMiddleware, addProduct)
  .put(authMiddleware, updateProduct)
  .delete(authMiddleware, deleteProduct);

export default router;
