import { Router } from 'express';
import { getSeries, getSetsBySeriesId } from '../controllers/card.controller.js';

const router = Router();

router.route('/series').get(getSeries);
router.route('/series/:seriesId/sets').get(getSetsBySeriesId);

export default router;
