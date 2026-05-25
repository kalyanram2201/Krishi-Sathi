import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getWeather = async (req, res) => {
  try {
    const city = req.params.city;
    const API_KEY = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;

    const alerts = generateAlerts(data);

    const result = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      alerts: alerts
    };

    res.json(result);
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
};

/* 🔥 Smart Alerts Logic */

const generateAlerts = (data) => {
  const alerts = [];

  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  if (temp > 35) {
    alerts.push({
      title: "High Temperature",
      message: "Avoid irrigation during peak heat hours"
    });
  }

  if (humidity > 80) {
    alerts.push({
      title: "High Humidity",
      message: "Risk of fungal diseases in crops"
    });
  }

  if (wind > 10) {
    alerts.push({
      title: "High Wind Speed",
      message: "Avoid pesticide spraying"
    });
  }

  if (temp < 10) {
    alerts.push({
      title: "Low Temperature",
      message: "Protect crops from cold stress"
    });
  }

  return alerts;
};

export const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = response.data;

    const result = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
    };

    res.json(result);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch location weather" });
  }
};