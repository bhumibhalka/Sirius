import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { getSavedPosts, toggleSavePost } from '../../controllers/save.controller.js';

const router = express.Router();

router.post(
  '/post-save/:postId',
  isAuthenticated,
  toggleSavePost
)

router.get(
  '/all-saved/post',
  isAuthenticated,
  getSavedPosts
)


export default router;