import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    crop: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    soilType: {
      type: String,
    },

    soilPH: {
      type: Number,
    },

    moisture: {
      type: String,
    },

    season: {
      type: String,
    },

    region: {
      type: String,
    },

    previousCrop: {
      type: String,
    },

    weather: {
      temperature: Number,
      humidity: Number,
      wind_speed: Number,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model(
  "Prediction",
  predictionSchema
);

export default Prediction;