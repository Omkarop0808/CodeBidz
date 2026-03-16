import express from "express";
import { secureRoute, checkAdmin } from "../middleware/auth.middleware.js";
import {
  getBidActivity,
  getTopAuctions,
  getCreditFlow,
  getCategoryPerformance,
  getTopBidders,
  getAuditLog,
} from "../controllers/analytics.controller.js";

const analyticsRoutes = express.Router();
analyticsRoutes.use(secureRoute);
analyticsRoutes.use(checkAdmin);

analyticsRoutes.get("/bid-activity", getBidActivity);
analyticsRoutes.get("/top-auctions", getTopAuctions);
analyticsRoutes.get("/credit-flow", getCreditFlow);
analyticsRoutes.get("/category-performance", getCategoryPerformance);
analyticsRoutes.get("/top-bidders", getTopBidders);
analyticsRoutes.get("/audit-log", getAuditLog);

export default analyticsRoutes;
