import express from 'express'
import { addProduct, deleteProduct, editProduct, fetchSellerProducts, filterProducts, getProduct, getProducts} from '../controllers/product.controller.js';
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

router.put(
  '/update-product',
  isAuthenticated,
  isAuthorized('seller'),
  editProduct
)

router.delete(
  '/delete/:id',
  isAuthenticated,
  isAuthorized('seller'),
  deleteProduct
)

router.get(
  '/all-products',
  isAuthenticated,
  getProducts
)

router.get(
  '/filter',
  isAuthenticated,
  filterProducts,
)


router.get(
  '/:id',
  isAuthenticated,
  getProduct
)
// router.post(
//   '/add-product',
//   isAuthenticated,
//   isAuthorized('seller'),
//   addProduct
// )

export default router;