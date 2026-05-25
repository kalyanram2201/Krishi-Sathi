import express from "express";
import { getWeather, getWeatherByCoords } from "../controllers/weatherController.js";

const router = express.Router();

/* ✅ FIX: specific route first */
router.get("/coords", getWeatherByCoords);

/* dynamic route last */
router.get("/:city", getWeather);

export default router;