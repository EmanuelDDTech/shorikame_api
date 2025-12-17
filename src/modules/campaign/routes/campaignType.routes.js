import { Router } from 'express';
import {
  createCampaignType,
  deleteCampaignType,
  getCampaignTypeAll,
  updateCampaignType,
} from '#modules/campaign/controllers/campaignType.controller.js';
import authMiddleware from '#src/middleware/authMiddleware';

const router = Router();

router.route('/').post(authMiddleware, createCampaignType).get(authMiddleware, getCampaignTypeAll);
router
  .route('/:id')
  // .get()
  .put(authMiddleware, updateCampaignType)
  .delete(authMiddleware, deleteCampaignType);

export default router;
