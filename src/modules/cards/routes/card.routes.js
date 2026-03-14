import { Router } from 'express';
import {
  getCardById,
  getSeries,
  getSetById,
  getSetsBySeriesId,
} from '../controllers/card.controller.js';

const router = Router();

router.route('/series').get(getSeries);
router.route('/series/:seriesId/sets').get(getSetsBySeriesId);
router.route('/sets/:setId').get(getSetById);
router.route('/card/:cardId').get(getCardById);

export default router;
