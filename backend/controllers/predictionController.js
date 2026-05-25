import Prediction from "../models/Prediction.js";

// SAVE PREDICTION
export const savePrediction = async (req, res) => {
  try {

    const prediction = await Prediction.create({
      user: req.user._id,

      crop: req.body.crop,

      confidence: req.body.confidence,

      soilType: req.body.soilType,

      soilPH: req.body.soilPH,

      moisture: req.body.moisture,

      season: req.body.season,

      region: req.body.region,

      previousCrop: req.body.previousCrop,

      weather: req.body.weather,
    });

    res.status(201).json(prediction);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// GET USER HISTORY
export const getPredictions = async (req, res) => {
  try {

    const predictions = await Prediction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(predictions);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};