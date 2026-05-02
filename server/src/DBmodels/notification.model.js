import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    index: true,
    required: true,
  },
  senderId :{
    type:String,
    required: true,
    index: true,
  },
  type: {
    type:String,
    enum: ['like', 'comment', 'follow',
       'order_update', 'promo',
       'paymenrt_received', 'wallet_low',
       'system_alert'],
    required: true,
  },
  // Reference to the object (Post ID, Order ID, etc.)
  relatedId :{
   type: mongoose.Schema.Types.ObjectId,
   required: false,
  },
  content: {
    type:String,
    required: true,
    // trim: true
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  // To handle deep-linking in the app
  metadata: {
    path: String,
    thumbnail: String,
  }
},{timestamps: true});

//COMPOUND INDEX: Optimized for fetching unread notifications quickly
notificationSchema.index({recipientId: 1, isRead: 1, createdAt: -1})

// TTL INDEX: Auto-delete notifications after 30 days to keep DB lean
// notificationSchema.index({createdAt: -1}, {expireAfterSeconds: 2592000})

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;