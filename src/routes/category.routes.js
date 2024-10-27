import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/productCategory.controller.js';

const router = Router();

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').get(getCategoryById).put(updateCategory).delete(deleteCategory);
router.route('/:id/grupos').get();

export default router;
