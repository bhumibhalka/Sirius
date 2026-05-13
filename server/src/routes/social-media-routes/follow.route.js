import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { getFollowers, toggleFollow } from '../../controllers/follow.controller.js';

const router = express.Router();

// router.put(
//   '/:targetUserId',
//   isAuthenticated,
//   toggleFollow
// )

router.get(
  '/get-data',
  isAuthenticated,
  getFollowers
)

export default router;