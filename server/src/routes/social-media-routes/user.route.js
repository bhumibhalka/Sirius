import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import {  getUsers, toggleLike } from '../../controllers/user.controller.js';

const router = express.Router();

router.get(
  '/search-users',
  isAuthenticated,
  getUsers
)

router.post(
  '/like/:postId',
  isAuthenticated,
  toggleLike
)



export default router;