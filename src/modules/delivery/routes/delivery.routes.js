import { Router } from 'express';
import {
  findAvailable,
  findZoneByZipCode,
  quoteShipping,
} from '#modules/delivery/controllers/delivery.controller.js';

const router = Router();

router.route('/').get(findAvailable);
router.route('/quote').get(quoteShipping).post(quoteShipping);
router.route('/zone/:zipCode').get(findZoneByZipCode);

export default router;
