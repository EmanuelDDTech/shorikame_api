import { Router } from 'express';
import { getSeries } from '../controllers/card.controller.js';

const router = Router();

router.route('/series').get(getSeries);

export default router;
