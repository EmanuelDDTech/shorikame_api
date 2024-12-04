import { Router } from 'express';
import { createBanner } from '../controllers/banner.controller.js';

const router = Router();

router.route('/').get().post(createBanner);
router.route('/:id').get().put().delete();

export default router;
