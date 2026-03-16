import Notification from "../models/notification.model.js";
import { getIO } from "../socket/index.js";

/**
 * Create a notification and optionally emit it via Socket.io
 */
export const createNotification = async ({
  userId,
  type,
  message,
  auctionId = null,
  emitSocket = true,
}) => {
  const notification = await Notification.create({
    userId,
    type,
    message,
    auctionId,
  });

  if (emitSocket) {
    try {
      const io = getIO();
      io.to(`user:${userId.toString()}`).emit("notification:new", {
        userId: userId.toString(),
        notification: {
          _id: notification._id,
          type: notification.type,
          message: notification.message,
          auctionId: notification.auctionId,
          read: notification.read,
          createdAt: notification.createdAt,
        },
      });
    } catch (e) {
      /* socket not ready */
    }
  }

  return notification;
};
