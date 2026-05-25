import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Leaf,
  Thermometer,
  TrendingUp,
  MapPin,
  Loader2,
  Droplets,
  Wind,
  CloudSun,
  Sprout,
} from "lucide-react";

import axios from "axios";

const CropSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Detecting...");
  const [locationLoading, setLocationLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [selectedSoil, setSelectedSoil] = useState("");

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      setLocationLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `http://localhost:5000/weather/coords?lat=${lat}&lon=${lon}`,
          );

          const data = await response.json();

          setCity(data.city || "Unknown");
          setLocationLoading(false);
        },
        (err) => {
          console.log(err);
          setCity("Hyderabad");
          setLocationLoading(false);
        },
      );
    } catch (err) {
      console.log(err);
      setCity("Hyderabad");
      setLocationLoading(false);
    }
  };

  const getRecommendationReason = (cropName, weatherData, soilType) => {
    const reasons = [];

    if (weatherData?.humidity > 60) {
      reasons.push("Current humidity supports healthy crop growth");
    }

    if (weatherData?.temperature >= 20 && weatherData?.temperature <= 35) {
      reasons.push("Temperature conditions are favorable");
    }

    if (soilType === "Loamy") {
      reasons.push("Loamy soil is highly fertile and nutrient-rich");
    }

    if (soilType === "Clay") {
      reasons.push("Clay soil retains moisture effectively");
    }

    if (soilType === "Sandy") {
      reasons.push("Sandy soil provides excellent drainage");
    }

    reasons.push(`${cropName} suits the current seasonal conditions`);

    return reasons;
  };

  const getCropDetails = (cropName) => {
    const details = {
      Maize: {
        water: "Moderate",
        growth: "90-120 days",
        fertilizer: "Nitrogen Rich",
        profitability: "High",
      },

      Rice: {
        water: "High",
        growth: "120-150 days",
        fertilizer: "Organic + NPK",
        profitability: "High",
      },

      Wheat: {
        water: "Moderate",
        growth: "100-130 days",
        fertilizer: "Nitrogen",
        profitability: "Moderate",
      },
    };

    return (
      details[cropName] || {
        water: "Moderate",
        growth: "90-120 days",
        fertilizer: "Balanced",
        profitability: "Moderate",
      }
    );
  };

  const onSubmit = async (data) => {
    setIsAnalyzing(true);
    setSuggestions([]);
    setError("");
    setSelectedSoil(data.soilType);

    try {
      const soilPH = Number(data.ph);

      // HIGHLY ACIDIC SOIL
      if (soilPH < 5) {
        setError(
          "Crop cultivation is not possible because the soil is highly acidic (pH below 5). Please improve soil conditions before growing crops.",
        );

        setSuggestions([]);

        setWeatherData(null);

        setIsAnalyzing(false);

        return;
      }

      // HIGHLY BASIC SOIL
      if (soilPH > 8) {
        setError(
          "Crop cultivation is not possible because the soil is highly basic/alkaline (pH above 8). Please balance the soil before growing crops.",
        );

        setSuggestions([]);

        setWeatherData(null);

        setIsAnalyzing(false);

        return;
      }

      const response = await fetch("http://127.0.0.1:5000/crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          city: city,
          Soil_Type: data.soilType,
          Soil_pH: Number(data.ph),
          Location_Region: city,
          Previous_Crop: data.previousCrop || "None",
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      // SAVE PREDICTION TO DATABASE
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.token) {
          const topCrop = result.recommendation?.top3?.[0] || result.top3?.[0];

          if (topCrop) {
            await axios.post(
              "http://localhost:5000/predictions",
              {
                crop: topCrop.name,

                confidence: topCrop.confidence,

                soilType: data.soilType,

                soilPH: Number(data.ph),

                moisture:
                  result.weather?.humidity > 70
                    ? "High"
                    : result.weather?.humidity < 40
                      ? "Low"
                      : "Medium",

                season: "Auto",

                region: city,

                previousCrop: data.previousCrop || "None",

                weather: result.weather,
              },
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            );

            console.log("Prediction saved successfully");
          }
        }
      } catch (saveError) {
        console.log("Prediction save failed:", saveError);
      }

      console.log("Backend response:", result);

      if (result.recommendation?.top3) {
        setSuggestions(result.recommendation.top3);
        setWeatherData(result.weather);
      } else if (result.top3) {
        setSuggestions(result.top3);
        setWeatherData(result.weather);
      } else {
        setError("No suggestions found");
      }
    } catch (err) {
      console.error("Backend error:", err);
      setError("Failed to fetch suggestions");
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Crop Suggestions
          </h1>

          <p className="text-lg text-gray-600">
            AI-powered crop recommendations using real-time weather intelligence
          </p>

          <div className="flex items-center justify-center mt-4 text-green-700 font-medium">
            <MapPin className="h-5 w-5 mr-2" />

            {locationLoading ? (
              <span>Detecting location...</span>
            ) : (
              <span>{city}</span>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Weather, moisture and seasonal intelligence are automatically
            analyzed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-8 flex items-center text-gray-800">
              <Leaf className="mr-2 h-6 w-6 text-green-600" />
              Farm Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Soil + pH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Soil Type
                  </label>

                  <select
                    {...register("soilType", { required: true })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select soil type</option>
                    <option value="Clay">Clay</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Red">Red</option>
                    <option value="Laterite">Laterite</option>
                  </select>
                </div>

                {/* Soil pH */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Thermometer className="mr-1 h-4 w-4 text-orange-500" />
                    Soil pH
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    {...register("ph", { required: true })}
                    className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="6.5"
                  />
                </div>
              </div>

              {/* Previous Crop */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Previous Crop
                </label>

                <input
                  type="text"
                  {...register("previousCrop")}
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Rice, Wheat"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Get AI Crop Suggestions
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* RESULTS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Recommended Crops
            </h2>

            {/* WEATHER CARD */}
            {weatherData && (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <CloudSun className="mr-2 text-blue-500" />
                  Current Weather
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Temperature</p>

                    <p className="font-bold text-lg">
                      🌡 {weatherData.temperature}°C
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Humidity</p>

                    <p className="font-bold text-lg">
                      💧 {weatherData.humidity}%
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Wind Speed</p>

                    <p className="font-bold text-lg">
                      🌬 {weatherData.wind_speed} m/s
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Condition</p>

                    <p className="font-bold text-lg capitalize">
                      ☁ {weatherData.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {suggestions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                {error ? (
                  <div className="bg-red-50 border border-red-200 rounded-3xl p-8 max-w-lg">
                    <div className="text-5xl mb-4">⚠️</div>

                    <h3 className="text-2xl font-bold text-red-700 mb-3">
                      Unsuitable Soil pH
                    </h3>

                    <p className="text-gray-700 leading-relaxed">{error}</p>

                    <div className="mt-5 bg-white rounded-2xl p-4 border border-red-100">
                      <p className="text-sm text-gray-600">
                        Recommended soil pH for most crops:
                      </p>

                      <p className="font-bold text-green-700 mt-1">5.5 - 7.5</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Fill the form to get AI-powered crop recommendations
                  </div>
                )}
              </div>
            ) : (
              suggestions.map((crop, index) => {
                const details = getCropDetails(crop.name);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-green-100 rounded-3xl p-6 mb-6 bg-green-50"
                  >
                    {/* Crop Name */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                        <Sprout className="mr-2 text-green-600" />
                        {crop.name}
                      </h3>

                      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </span>
                    </div>

                    {/* Confidence */}
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">AI Confidence</span>

                        <span className="font-semibold text-green-700">
                          {(crop.confidence * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-4 rounded-full transition-all duration-700"
                          style={{
                            width: `${crop.confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Why this crop */}
                    <div className="mt-5 border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Why this crop?
                      </h4>

                      <ul className="space-y-2">
                        {getRecommendationReason(
                          crop.name,
                          weatherData,
                          selectedSoil,
                        ).map((reason, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-start"
                          >
                            ✅ <span className="ml-2">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Crop Details */}
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Water Need</p>

                        <p className="font-semibold flex items-center mt-1">
                          <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                          {details.water}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Growth Time</p>

                        <p className="font-semibold mt-1">{details.growth}</p>
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Fertilizer</p>

                        <p className="font-semibold mt-1">
                          {details.fertilizer}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Profitability</p>

                        <p className="font-semibold text-green-700 mt-1">
                          {details.profitability}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestion;
