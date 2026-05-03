import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { getUsers } from '../../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/search-users',
  isAuthenticated,
  getUsers
)

export default router;