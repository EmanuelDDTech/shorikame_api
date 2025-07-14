import { Router } from 'express';
import {
  createFilterValue,
  deleteFilterValue,
  getFilterValueById,
  updateFilterValues,
} from '../controllers/filterValue.controller.js';

const router = Router();

router.route('/').post(createFilterValue);
router.route('/:id').get(getFilterValueById).put(updateFilterValues).delete(deleteFilterValue);

export default router;
