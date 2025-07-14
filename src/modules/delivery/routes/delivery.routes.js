import { Router } from 'express';
import { findAvailable } from '#modules/delivery/controllers/delivery.controller.js';

const router = Router();

router.route('/').get(findAvailable);

export default router;
