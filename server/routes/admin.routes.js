import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  assignCredits,
  getAllAuctions,
  declareAuctionWinner,
  editAuction,
  deleteAuction,
  toggleUserStatus,
  resetUserPassword,
} from "../controllers/admin.controller.js";
import { checkAdmin, secureRoute } from "../middleware/auth.middleware.js";

const adminRoutes = express.Router();
adminRoutes.use(secureRoute);

// Dashboard
adminRoutes.get("/dashboard", checkAdmin, getAdminDashboard);

// Users
adminRoutes.get("/users", checkAdmin, getAllUsers);
adminRoutes.patch("/users/:id/status", checkAdmin, toggleUserStatus);
adminRoutes.patch("/users/:id/reset-password", checkAdmin, resetUserPassword);

// Credits
adminRoutes.post("/assign-credits", checkAdmin, assignCredits);

// Auctions
adminRoutes.get("/auctions", checkAdmin, getAllAuctions);
adminRoutes.post("/auctions/:id/declare-winner", checkAdmin, declareAuctionWinner);
adminRoutes.patch("/auctions/:id", checkAdmin, editAuction);
adminRoutes.delete("/auctions/:id", checkAdmin, deleteAuction);

export default adminRoutes;
