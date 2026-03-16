import express from "express";
import { generateDescription } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-description", generateDescription);

export default router;
