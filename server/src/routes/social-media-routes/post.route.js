import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { createPost, fetchHomeFeed } from '../../controllers/post.controller.js';

const router = express.Router();

router.post(
  '/create-post',
  isAuthenticated,
  createPost
)

router.get(
  '/all-posts',
  isAuthenticated,
  fetchHomeFeed
)

export default router;