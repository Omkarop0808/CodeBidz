import express from "express";
import { secureRoute } from "../middleware/auth.middleware.js";
import { getRecommendations } from "../controllers/recommendation.controller.js";

const recommendationRoutes = express.Router();
recommendationRoutes.use(secureRoute);
recommendationRoutes.get("/:userId", getRecommendations);

export default recommendationRoutes;
