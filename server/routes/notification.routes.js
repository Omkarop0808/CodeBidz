import express from "express";
import {
  getNotifications,
  markAllRead,
  markOneRead,
  getUnreadCount,
} from "../controllers/notification.controller.js";
import { secureRoute } from "../middleware/auth.middleware.js";

const notificationRoutes = express.Router();
notificationRoutes.use(secureRoute);

notificationRoutes.get("/", getNotifications);
notificationRoutes.get("/unread-count", getUnreadCount);
notificationRoutes.patch("/read-all", markAllRead);
notificationRoutes.patch("/:id/read", markOneRead);

export default notificationRoutes;
