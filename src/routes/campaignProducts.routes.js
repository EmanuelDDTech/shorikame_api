import { Router } from 'express';
import {
  createCampaignProduct,
  deleteByCampaignId,
  deleteCampaignProduct,
  getByCampaignId,
  getCampaignProductAll,
  updateCampaignProduct,
} from '../controllers/campaignProduct.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(authMiddleware, createCampaignProduct).get(getCampaignProductAll);
router.route('/campaign/:campaignId').get(getByCampaignId);
router
  .route('/:id')
  .put(authMiddleware, updateCampaignProduct)
  .delete(authMiddleware, deleteCampaignProduct);
router.route('/campana/:id').delete(authMiddleware, deleteByCampaignId);

export default router;
