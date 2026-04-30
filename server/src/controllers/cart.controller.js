import Cart from "../DBmodels/cart.model.js";
import Product from "../DBmodels/product.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";

export const addToCart = asyncHandler(async(req,res,next)=> {
  const {productId, quantity = 1 } = req.body;
  const userId = req.user.id;
  
  const product = await Product.findById(productId);
  if(!product) {
    return next (new ErrorHandler('Product not found',404))
  }

  let cart = await Cart.findOne({userId});
  if(!cart){
    cart = await Cart.create({
      userId,
      items:[{
        productId,
        quantity,
      }]
    })

    return res?.status(201).json({
      success: true,
      message: 'Product added',
      cart
    })
  }

  const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId 
);

if(itemIndex > -1) {
  cart.items[itemIndex].quantity += quantity;
}else{
  cart.items.push({productId, quantity})
}

await cart.save();

res.status(200).json({
  success: true,
  message: 'Product added to cart',
  cart,
})


})

export const getCartItems = asyncHandler(async(req,res,next)=> {
  const userId = req.user.id;

  const cartItems = await Cart.findOne({userId}).sort({createdAt: -1}).populate("items.productId").lean();
  
  res.status(200).json({
    success: true,
    cartItems,
  })
})
