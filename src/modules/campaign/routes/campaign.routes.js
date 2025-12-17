import { Router } from 'express';
import {
  createCampaign,
  deleteCampaign,
  getCampaignAll,
  getCampaignAllAdmin,
  getCampaignById,
  updateCampaign,
} from '#modules/campaign/controllers/campaign.controller.js';
import authMiddleware from '#src/middleware/authMiddleware';

const router = Router();

router.route('/').get(getCampaignAll).post(authMiddleware, createCampaign);
router
  .route('/:id')
  .get(authMiddleware, getCampaignById)
  .put(authMiddleware, updateCampaign)
  .delete(authMiddleware, deleteCampaign);

export default router;
