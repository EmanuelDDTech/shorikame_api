import { Router } from 'express';
import { capture, order } from '../controllers/paypal.controller.js';

const router = Router();

router.post('/orders', order);
router.post('/orders/:orderID/capture', capture);

export default router;
