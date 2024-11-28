import { Router } from 'express';
import { saveFilterProduct } from '../controllers/filterValueProduct.controller.js';

const router = Router();

router.route('/').post(saveFilterProduct);

export default router;
