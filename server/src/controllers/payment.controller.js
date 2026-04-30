import stripe from "../lib/stripe.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const createCheckoutSession = asyncHandler(async(req,res,next)=> {
  const {items} = req.body;

  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.productId.title,
        images: [item.productId.media[0].url],
      },
      unit_amount: item.productId.variants[0].price * 100
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost/cart`
  })

  res.status(200).json({
    success: true,
    url: session.url,
  })
})