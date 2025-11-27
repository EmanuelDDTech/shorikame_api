import { Router } from 'express';
import {
  createPreference,
  getPaymentInfoService,
  processPayment,
  webhook,
} from '../controllers/mercadopago.controller.js';

const router = Router();

router.post('/create-preference', createPreference);
router.post('/webhook', webhook);

router.get('/payment/:paymentId', getPaymentInfoService);

router.post('/process/payment', processPayment);

export default router;
