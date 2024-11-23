import { Router } from 'express';
import {
  createProductGallery,
  getProductGalleryAll,
} from '../controllers/productGallery.controller.js';

const router = Router();

router.route('/').post(createProductGallery).put();
router.route('/:id').delete();
router.route('/:product_id').get(getProductGalleryAll);

export default router;
