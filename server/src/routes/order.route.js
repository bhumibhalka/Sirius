import express from 'express'
import { handleStripeWebhook } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getOrders, placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

// router.post(
//   '/stripe/webhook',
//   express.raw({ type: "application/json "}),
//   handleStripeWebhook
// )

router.use(isAuthenticated);

router.post(
  '/create',
  placeOrder
)

router.get( 
  '/get-orders',
  getOrders
)

export default router;