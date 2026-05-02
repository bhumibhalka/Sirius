import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { createPost, fetchHomeFeed, getPosts, getUserPosts } from '../../controllers/post.controller.js';

const router = express.Router();

router.post(
  '/create-post',
  isAuthenticated,
  createPost
)

router.get(
  '/home-feed',
  isAuthenticated,
  fetchHomeFeed
)

router.get(
  '/user/posts',
  isAuthenticated,
  getUserPosts
)

router.get(
  '/all-posts',
  isAuthenticated,
  getPosts
)


export default router;