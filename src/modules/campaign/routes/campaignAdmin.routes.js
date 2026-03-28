import { Router } from 'express';
import authMiddleware from '#src/middleware/authMiddleware.js';
import { getCampaignAllAdmin } from '#modules/campaign/controllers/campaign.controller.js';

const router = Router();

router.route('/').get(authMiddleware, getCampaignAllAdmin);

export default router;
