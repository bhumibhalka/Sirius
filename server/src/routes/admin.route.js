import express from 'express'
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware.js';
import { getAdminStats } from '../controllers/user.controller.js';

const router = express.Router();

router.use(isAuthenticated, isAuthorized('admin'))

router.get(
  '/stats',
  getAdminStats
)

export default router;