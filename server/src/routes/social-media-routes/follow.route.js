import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import {  getFollowData, toggleFollow } from '../../controllers/follow.controller.js';

const router = express.Router();

// router.put(
//   '/:targetUserId',
//   isAuthenticated,
//   toggleFollow
// )

router.get(
  '/:userId/follow-data',
  isAuthenticated,
  getFollowData
)

export default router;