import express from "express";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";
import {  createComment, getComments } from "../../controllers/user.controller.js";

const router = express.Router();

router.post(
  '/create-comment',
  isAuthenticated,
  createComment
)

router.get(
  '/comments/:postId',
  isAuthenticated,
  getComments
)

export default router;