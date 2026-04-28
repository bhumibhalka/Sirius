import express from 'express'
import { addProduct, fetchSellerProducts} from '../controllers/product.controller.js';
import { isAuthenticated, isAuthorized } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/add-product',
  isAuthenticated,
  isAuthorized('seller'),
  addProduct
)

router.get(
  '/fetch-seller-products',
  isAuthenticated,
  isAuthorized('seller'),
  fetchSellerProducts
)

// router.post(
//   '/add-product',
//   isAuthenticated,
//   isAuthorized('seller'),
//   addProduct
// )

export default router;