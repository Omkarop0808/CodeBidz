import express from "express";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.config.js";
import {
  authRoutes,
  userRoutes,
  auctionRoutes,
  contactRoutes,
  adminRoutes,
  aiRoutes,
} from "./routes/index.js";
import creditRoutes from "./routes/credit.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import { connectDB } from "./config/db.config.js";

export const app = express();

app.use(
  cors({
    origin: env.origin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(compression());
app.use(express.json());

// DB connection for Vercel serveless deployment
if (process.env.VERCEL) {
  app.use(async (req, res, next) => {
    await connectDB();
    next();
  });
}


app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/auction", auctionRoutes);
app.use("/contact", contactRoutes);
app.use("/admin", adminRoutes);
app.use("/ai", aiRoutes);
app.use("/credits", creditRoutes);
app.use("/notifications", notificationRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/recommendations", recommendationRoutes);

export default app; // Exporting default app for serverless deployment
