import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {type:String, required: true},
    price: {type: Number, required: true},
    quantity :{type: Number, required: true, min: 1},
    img: String,
  }],
  totalAmount :{
    type:Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentIntentId: {
    type: String,
    unique: true, 
    sparse: true
  },
  shippingAddress: {
    street: String,
    city: String,
    country: String,
    zipCode: String,
  },
  trackingNumber: String,
},{timestamps: true})

orderSchema.index({userId: 1, createdAt: -1});

const Order = mongoose.model('Order', orderSchema)
export default Order;