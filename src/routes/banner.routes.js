import { Router } from 'express';
import {
  createBanner,
  getBannerAll,
  getBannerById,
  updateBanner,
} from '../controllers/banner.controller.js';

const router = Router();

router.route('/').get(getBannerAll).post(createBanner);
router.route('/:id').get(getBannerById).put(updateBanner).delete();

export default router;
