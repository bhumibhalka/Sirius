import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { getProfile, updateProfile } from '../../controllers/profile.controller.js';
import { toggleFollow } from '../../controllers/follow.controller.js';

const router = express.Router();

router.use(isAuthenticated)

router.get(
  '/:username',
  getProfile,
)

router.post(
  '/follow/:targetUserId',
  toggleFollow,
)

router.put(
  '/update',
  updateProfile
)

export default router;