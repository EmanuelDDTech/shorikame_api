import { Router } from 'express';
import { findAvailable } from '../controllers/delivery.controller.js';

const router = Router();

router.route('/').get(findAvailable);

export default router;
