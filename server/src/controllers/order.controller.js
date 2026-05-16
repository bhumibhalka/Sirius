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
    sellerId : product.sellerId,
    name: product.title,
    price: variant.price,
    quantity: item.quantity,
    image: product.media?.[0]?.url || "",
  })
}

const order = await Order.create({
 userId,
 customerName: req.user.username,
 customerEmail: req.user.email,
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

  const nextCursor = orders.length === Number(limit) ? orders[orders.length - 1 ].createdAt : null ;

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
    nextCursor
  })
})

export const getSellerOrders = asyncHandler(async(req,res,next) => {
  const {status, cursor, limit = 10} = req.query;
  const sellerId = req.user.id;

  const query = {"items.sellerId" : sellerId};

  if(cursor) query.createdAt = { $lt : new Date(cursor) }

  const orders = await Order.find(query)
  .limit(Number(limit))
  .sort({createdAt: -1})
  .lean();

  const sellerView = orders.map((order) => {
    const myItems = order.items.filter(item => item.sellerId === sellerId);
    const mySubtotal = myItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return ({
      _id: order._id,
      status: order.status,
      customerName: order.customerName,
      items: myItems,
      subtotal: mySubtotal,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,

    })
  })

  const nextCursor = orders.length === Number(limit) ? orders[orders.length -  1].createdAt : null;

  res.status(200).json({
    success: true,
    data: sellerView,
    nextCursor,
  })
})

// export const getSellerOrders = asyncHandler(async(req,res,next) => {
//   const { status, cursor, limit = 10} = req.query;
//   const sellerId = req.user.id;

//   const query = {'items.sellerId' : sellerId};

//   if(status) query.status = status;
  
//   if(cursor) query.createdAt = {$lt: new Date(cursor)};

//   const orders = await Order.find(query)
//   .sort({createdAt: -1})
//   .limit(Number(limit))
//   .lean();

//   const sellerView = orders.map((order) => {
//     const myItems = order.items.filter((item) => item.sellerId === sellerId)
//     const mySubtotal = myItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     return {
//       _id: order._id,
//       status: order.status,
//       customerName: order.customerName,
//       items: myItems,
//       subtotal: mySubtotal,
//       createdAt: order.createdAt,
//       shippingAddress: order.shippingAddress
//     }
//   })

//   const nextCursor = orders.length === Number(limit) ? orders[orders.length - 1].createdAt : null;

//   res.status(200).json({
//     success: true,
//     data: sellerView,
//     nextCursor,
//   })

// })



// export const getSellerOrders = asyncH andler(async(req,res,next)=> {
//   const { status ,cursor, limit = 10} = req.query;
//   const sellerId = req.user.id;
 
//   const query = {"items.sellerId" : sellerId};

//   if(status) query.status = status;

//   if(cursor) query.createdAt = { $lt: new Date(cursor)};

//   const orders = await Order.find(query)
//   .sort({createdAt: -1})
//   .limit(Number(limit))
//   .lean();

//   const sellerView = orders.map((order) => {
//     const myItems = order.items.filter(item => item.sellerId === sellerId);
//     const mySubtotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

//     return {
//       _id: order._id,
//       status: order.status,
//       customerName: order.shippingAddress.name,
//       item: myItems,
//       subtotal: mySubtotal,
//       createdAt: order.createdAt,
//       shippingAddress: order.shippingAddress
//     }
//   })

//   const nextCursor = orders.length === Number(limit) ? orders[orders.length - 1] : null;

//   res.status(200).json({
//     success: true,
//     data: sellerView,
//     nextCursor,
//   })

// })

