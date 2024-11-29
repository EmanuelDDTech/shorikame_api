import { Router } from 'express';
import {
  findByProductId,
  saveFilterProduct,
} from '../controllers/filterValueProduct.controller.js';

const router = Router();

router.route('/').post(saveFilterProduct);
router.route('/:productId').get(findByProductId);

export default router;
