import { Router } from 'express';
import { getProducts } from '../controllers/products.controller.js';
import authMiddleware from '#src/middleware/authMiddleware';

const router = Router();

router.route('/').get(getProducts);
router.route('/admin').get(authMiddleware, getProducts);

export default router;
