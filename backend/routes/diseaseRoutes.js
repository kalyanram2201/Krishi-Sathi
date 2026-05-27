import express from "express";

import multer from "multer";

import axios from "axios";

import FormData from "form-data";

import fs from "fs";

import Prediction from "../models/Prediction.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/predict",

  protect,

  upload.single("image"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No image uploaded",
        });
      }

      const formData = new FormData();

      formData.append(
        "image",
        fs.createReadStream(req.file.path)
      );

      const flaskResponse = await axios.post(
        `${process.env.ML_API_URL}/predict-disease`,

        formData,

        {
          headers: formData.getHeaders(),
        }
      );

      fs.unlinkSync(req.file.path);

      const predictionData = flaskResponse.data;

      // SAVE TO DATABASE
      const savedPrediction =
        await Prediction.create({

          user: req.user._id,

          crop: predictionData.disease,

          confidence:
            predictionData.confidence,

          soilType: "Disease Detection",

          region: "N/A",

          weather: {
            temperature: 0,
            humidity: 0,
          },
        });

      res.json({
        ...predictionData,
        savedPrediction,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Disease prediction failed",
      });
    }
  }
);

export default router;