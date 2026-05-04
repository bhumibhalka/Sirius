import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { createComment, getUsers, toggleLike } from '../../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/search-users',
  isAuthenticated,
  getUsers
)

router.post(
  '/like/:postId',
  isAuthenticated,
  toggleLike
)

router.post(
  '/comment',
  isAuthenticated,
  createComment
)

export default router;