import { Router } from 'express';
import {
  createFilterCategory,
  deleteFilterCategory,
  getFiltersCategory,
} from '../controllers/filterCategory.controller.js';

const router = Router();

router.route('/').post(createFilterCategory);
router.route('/:categId').get(getFiltersCategory);
router.route('/:id').delete(deleteFilterCategory);

export default router;
