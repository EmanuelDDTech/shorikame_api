import { Router } from 'express';
import {
  createProductGallery,
  getProductGalleryAll,
  updateGallery,
} from '../controllers/productGallery.controller.js';

const router = Router();

router.route('/').post(createProductGallery);
router.route('/:product_id').delete().put(updateGallery);
router.route('/:product_id').get(getProductGalleryAll);

export default router;
