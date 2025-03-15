import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getCampaignAllAdmin } from '../controllers/campaign.controller.js';

const router = Router();

router.route('/').get(authMiddleware, getCampaignAllAdmin);

export default router;
