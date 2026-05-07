import Order from "../DBmodels/order.model.js";
import Product from "../DBmodels/product.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { ENV } from "../lib/ENV.js";


export const placeOrder = asyncHandler(async(req,res,next) => {
 const {items, shippingAddress } = req.body;
 const userId = req.user.id;
 
 let calculatedTotal = 0;
 const orderItems = [];

for(const item of items) {
  const product = await Product.findById(item.productId);

  const variant = product?.variants?.[0];

  if(!product || variant.stock  < item.quantity){
    return res.status(400).json({
      message: `Product ${item.name} is out of stock`
    })
  }


  calculatedTotal += variant.price * item.quantity;
  orderItems.push({
    productId: product._id,
    name: product.title,
    price: variant.price,
    quantity: item.quantity,
    image: product.media?.[0]?.url || "",
  })
}

const order = await Order.create({
 userId,
 items: orderItems,
 totalAmount: calculatedTotal,
 shippingAddress,
 status: 'pending',
});

res.status(201).json({
  success: true,
  orderId: order._id,
  total: calculatedTotal,
  order
})

})

export const getOrders = asyncHandler(async(req,res,next) => {
  const {cursor, limit = 10} = req.query;
  const userId = req.user.id;

  const query = {userId}
  if(cursor) {
    query.createdAt  = {$lt :new Date(cursor)};
  }

  const orders = await Order.find(query)
  .sort({createdAt: -1})
  .limit(Number(limit))
  .lean();

  const nextCursor = orders.length === Number(limit) ? orders[orders.length - 1 ] : null ;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
    nextCursor
  })
})