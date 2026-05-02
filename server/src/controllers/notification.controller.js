import Notification from "../DBmodels/notification.model.js";
import Profile from "../DBmodels/profile.model.js";
import { io } from "../lib/socket.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const createNotification = asyncHandler(async(recipientId, senderId, type, relatedId, content, metadata = {})=> {
  
   if(recipientId === senderId) return;

   const sender = await Profile.findOne({accountId: senderId})
   .select('displayName avatar')
   .lean();

   const notification = await Notification.create({
    recipientId,
    senderId,
    type,
    relatedId,
    content,
    metadata: {
      ...metadata,
      senderName: sender?.displayName,
      senderAvatar: sender?.avatar
    }
   });

   io.to(recipientId).emit('NOTIFICATION_RECEIVED', notification);

   return notification
})