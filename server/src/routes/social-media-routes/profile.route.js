import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { getProfile } from '../../controllers/profile.controller.js';
import { toggleFollow } from '../../controllers/follow.controller.js';

const router = express.Router();

router.get(
  '/:username',
  isAuthenticated,
  getProfile
)

router.post(
  '/follow/:targetUserId',
  isAuthenticated,
  toggleFollow
)

export default router;