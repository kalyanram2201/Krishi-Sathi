import express from "express";

import {
  savePrediction,
  getPredictions,
} from "../controllers/predictionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, savePrediction);

router.get("/", protect, getPredictions);

export default router;