import { Router } from 'express';
import authMiddleware from '#src/middleware/authMiddleware.js';
import {
  findAvailable,
  findZoneByZipCode,
  quoteCurrentCartShipping,
  quoteShipping,
} from '#modules/delivery/controllers/delivery.controller.js';

const router = Router();

router.route('/').get(findAvailable);
router.route('/quote').get(quoteShipping).post(quoteShipping);
router
  .route('/cart/quote')
  .get(authMiddleware, quoteCurrentCartShipping)
  .post(authMiddleware, quoteCurrentCartShipping);
router.route('/zone/:zipCode').get(findZoneByZipCode);

export default router;
