import { Router } from 'express';
import {
  createCampaign,
  deleteCampaign,
  getCampaignAll,
  getCampaignById,
  updateCampaign,
} from '../controllers/campaign.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(getCampaignAll).post(authMiddleware, createCampaign);
router
  .route('/:id')
  .get(authMiddleware, getCampaignById)
  .put(authMiddleware, updateCampaign)
  .delete(authMiddleware, deleteCampaign);

export default router;
