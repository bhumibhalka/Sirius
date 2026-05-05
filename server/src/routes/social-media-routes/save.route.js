import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { toggleSavePost } from '../../controllers/save.controller.js';

const router = express.Router();

router.post(
  '/post-save/:postId',
  isAuthenticated,
  toggleSavePost
)

export default router;