import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
} from "../controllers/admin.controller.js";
import { checkAdmin, secureRoute } from "../middleware/auth.middleware.js";

const adminRoutes = express.Router();
adminRoutes.use(secureRoute);

adminRoutes.get("/dashboard", checkAdmin, getAdminDashboard);
adminRoutes.get("/users", checkAdmin, getAllUsers);

import { assignCredits } from "../controllers/admin.controller.js";
adminRoutes.post("/assign-credits", checkAdmin, assignCredits);

export default adminRoutes;
