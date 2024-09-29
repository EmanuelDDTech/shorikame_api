import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/users.controllers.js';

const router = Router();

router.get('/', (req, res) => {
  res.send({ hola: 'hell' });
});

router.route('/users').get(getUsers).post(createUser);

router.route('/users/:id').get(getUserById).delete(deleteUser).put(updateUser);

export default router;
