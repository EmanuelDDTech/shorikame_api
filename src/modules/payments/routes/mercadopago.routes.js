import { Router } from 'express';
import { createPreference, webhook } from '../controllers/mercadopago.controller.js';

const router = Router();

router.post('/create-preference', createPreference);
router.post('/webhook', webhook);

export default router;
