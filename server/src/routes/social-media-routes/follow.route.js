import express from 'express'
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { toggleFollow } from '../../controllers/follow.controller.js';

const router = express.Router();

// router.put(
//   '/:targetUserId',
//   isAuthenticated,
//   toggleFollow
// )

export default router;