import express from "express";
import { getCropRecommendation } from "../controllers/cropController.js";

const router = express.Router();

router.post("/", getCropRecommendation);

export default router;