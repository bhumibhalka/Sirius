import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { addToCart, getCartItems } from '../controllers/cart.controller.js';

const router = express.Router();

router.put(
  '/add-to-cart',
  isAuthenticated,
  addToCart
)

router.get(
  '/cart-items',
  isAuthenticated,
  getCartItems
)

export default router;