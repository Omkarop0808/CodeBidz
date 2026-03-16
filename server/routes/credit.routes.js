import express from "express";
import { getCreditBalance, getCreditHistory } from "../controllers/credit.controller.js";
import { secureRoute } from "../middleware/auth.middleware.js";

const creditRoutes = express.Router();
creditRoutes.use(secureRoute);

creditRoutes.get("/balance", getCreditBalance);
creditRoutes.get("/history", getCreditHistory);

export default creditRoutes;
