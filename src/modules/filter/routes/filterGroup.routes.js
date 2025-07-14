import { Router } from 'express';
import {
  createFilterGroup,
  deleteFilterGroup,
  getFilterGroupById,
  getFilterGroups,
  updateFilterGroup,
} from '../controllers/filterGroup.controller.js';

const router = Router();

router.route('/').get(getFilterGroups).post(createFilterGroup);
router.route('/:id').get(getFilterGroupById).put(updateFilterGroup).delete(deleteFilterGroup);

export default router;
