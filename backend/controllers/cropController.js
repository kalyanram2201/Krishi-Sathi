import axios from "axios";

export const getCropRecommendation = async (req, res) => {
  try {
    const {
      city,
      Soil_Type,
      Soil_pH,
      Moisture_Level,
      Season,
      Location_Region,
      Previous_Crop,
    } = req.body;

    const requestCity = city || Location_Region || "Hyderabad";

    // 1️⃣ Get weather data
    const weatherRes = await axios.get(
      `${process.env.BACKEND_URL}/weather/${requestCity}`
    );

    const weather = weatherRes.data;

    // 2️⃣ Convert humidity → Moisture level only when not provided
    let moisture = "Medium";
    if (weather.humidity > 70) moisture = "High";
    else if (weather.humidity < 40) moisture = "Low";

    // 3️⃣ Detect season only when not provided
    const month = new Date().getMonth();
    let detectedSeason = "Kharif";

    if (month >= 10 || month <= 1) detectedSeason = "Rabi";
    else if (month >= 2 && month <= 5) detectedSeason = "Summer";

    // 4️⃣ Prepare ML input using frontend values when available
    const mlInput = {
      Soil_Type,
      Soil_pH,
      Moisture_Level: Moisture_Level || moisture,
      Season: Season || detectedSeason,
      Location_Region: Location_Region || requestCity,
      Previous_Crop: Previous_Crop || "None",
    };

    // 5️⃣ Call ML API
    const mlRes = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      
      mlInput
    );

    res.json({
      weather,
      recommendation: mlRes.data
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Integration failed" });
  }
};