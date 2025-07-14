import { Router } from 'express';
import {
  createBanner,
  deleteBanner,
  getBannerAll,
  getBannerById,
  updateBanner,
} from '../controllers/banner.controller.js';

const router = Router();

router.route('/').get(getBannerAll).post(createBanner);
router.route('/:id').get(getBannerById).put(updateBanner).delete(deleteBanner);

export default router;
