import Stripe from "stripe";
import { ENV } from "../lib/ENV.js";
// import stripe from "../lib/stripe.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import Order from "../DBmodels/order.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async(req,res,next)=> {
  const {orderId} = req.body;

  const order = await Order.findById(orderId);
  if(!order) return res.status(404).json({
    message: 'Order not found'
  })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency:'usd',
    metadata: {orderId: order._id.toString(), userId: req.user.id},
    automatic_payment_methods: {enabled: true},
  })

  // const line_items = items.map((item) => ({
  //   price_data: {
  //     currency: "usd",
  //     product_data: {
  //       name: item.productId.title,
  //       images: [item.productId.media[0].url],
  //     },
  //     unit_amount: item.productId.variants[0].price * 100
  //   },
  //   quantity: item.quantity,
  // }));

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items,
  //   mode: "payment",
  //   success_url: `http://localhost:5173/success`,
  //   cancel_url: `http://localhost/cart`
  // })

 order.paymentIntentId = paymentIntent.id;
   await order.save();

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  })
})

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 1. Verify the event came from Stripe using your Webhook Secret
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      ENV.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle specific event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
  
      if (!paymentIntent.metadata?.orderId) {
    console.log("⚠️ No orderId found in metadata");
    break;
    }

      await fulfillOrder(paymentIntent.metadata.orderId);
      break;

    case 'payment_intent.payment_failed':
      // Notify user their card was declined
      await handleFailure(event.data.object.metadata.orderId);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // 3. Return a 200 to Stripe to stop retries
  res.json({ received: true });
};

async function fulfillOrder(orderId) {
  // Update Order Status, Decrease Inventory, Send Email
  await Order.findByIdAndUpdate(orderId, { status: 'paid' });
  console.log(`✅ Order ${orderId} finalized via Webhook.`);
}