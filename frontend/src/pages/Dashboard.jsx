import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { getPredictions } from "../services/predictionService";

import {
  Brain,
  Leaf,
  CloudRain,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [predictions, setPredictions] = useState([]);

  // AUTH CHECK
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // FETCH PREDICTIONS
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await getPredictions();

        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    if (user) {
      fetchPredictions();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // ANALYTICS
  const totalPredictions = predictions.length;

  const averageConfidence =
    predictions.length > 0
      ? (predictions.reduce((acc, item) => acc + item.confidence, 0) /
          predictions.length) *
        100
      : 0;

  const cropFrequency = {};

  predictions.forEach((item) => {
    cropFrequency[item.crop] = (cropFrequency[item.crop] || 0) + 1;
  });

  const topCrop =
    Object.keys(cropFrequency).length > 0
      ? Object.keys(cropFrequency).reduce((a, b) =>
          cropFrequency[a] > cropFrequency[b] ? a : b,
        )
      : "N/A";

  // QUICK ACTIONS
  const actions = [
    {
      icon: Brain,
      title: "Disease Detection",
      text: "Scan crop leaves for diseases",
      path: "/disease-detection",
      color: "bg-red-500",
    },

    {
      icon: Leaf,
      title: "Crop Suggestions",
      text: "Get crop recommendations",
      path: "/crop-suggestion",
      color: "bg-green-500",
    },

    {
      icon: CloudRain,
      title: "Weather Forecast",
      text: "Check weather conditions",
      path: "/weather",
      color: "bg-blue-500",
    },

    {
      icon: ShoppingBag,
      title: "Marketplace",
      text: "Buy farming supplies",
      path: "/marketplace",
      color: "bg-purple-500",
    },
  ];

  // RECENT ACTIVITY
  const activities = [
    {
      icon: CheckCircle,
      title: "Disease scan completed",
      text: "Tomato leaf - Healthy",
      time: "2 hours ago",
      type: "success",
    },

    {
      icon: AlertTriangle,
      title: "Weather alert",
      text: "Heavy rainfall expected tomorrow",
      time: "4 hours ago",
      type: "warning",
    },

    {
      icon: Leaf,
      title: "Crop suggestion generated",
      text: "AI crop recommendation completed",
      time: "1 day ago",
      type: "info",
    },

    {
      icon: ShoppingBag,
      title: "Order placed",
      text: "Organic fertilizer - 50kg",
      time: "2 days ago",
      type: "success",
    },
  ];

  // DYNAMIC STATS
  const stats = [
    {
      title: "Total Predictions",
      value: totalPredictions,
      change: "AI recommendations generated",
      color: "text-green-600",
    },

    {
      title: "Average Confidence",
      value: `${averageConfidence.toFixed(1)}%`,
      change: "Model confidence score",
      color: "text-blue-600",
    },

    {
      title: "Top Recommended Crop",
      value: topCrop,
      change: "Most suggested crop",
      color: "text-emerald-600",
    },

    {
      title: "Prediction History",
      value: predictions.length,
      change: "Stored in database",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Farmer Dashboard
            </h1>

            <p className="text-gray-600 mt-2">
              Welcome back {user?.name || "Farmer"}! Here&apos;s what&apos;s
              happening on your farm.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.1,
              }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>

                  <p className="text-3xl font-bold mt-2">{item.value}</p>

                  <p className={`text-sm mt-1 ${item.color}`}>{item.change}</p>
                </div>

                <TrendingUp className={`h-8 w-8 ${item.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* PREDICTION HISTORY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Crop Predictions
            </h2>

            <span className="text-sm text-gray-500">
              Showing latest 3 predictions
            </span>
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No prediction history available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.slice(0, 3).map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{
                    scale: 1.02,
                  }}
                  className="border border-green-100 rounded-2xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm"
                >
                  {/* CROP */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-green-700">
                      🌱 {item.crop}
                    </h3>

                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                      AI
                    </span>
                  </div>

                  {/* CONFIDENCE */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Confidence</span>

                      <span className="font-semibold text-green-700">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${item.confidence * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Soil:</strong> {item.soilType}
                    </p>

                    <p>
                      <strong>Region:</strong> {item.region}
                    </p>

                    <p>
                      <strong>Temperature:</strong> {item.weather?.temperature}
                      °C
                    </p>

                    <p>
                      <strong>Humidity:</strong> {item.weather?.humidity}%
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ACTIONS + ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QUICK ACTIONS */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="bg-white rounded-2xl shadow"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actions.map((action) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group p-4 border rounded-xl hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="ml-4">
                      <h3 className="text-sm font-medium">{action.title}</h3>

                      <p className="text-sm text-gray-500">{action.text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* RECENT ACTIVITY */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="bg-white rounded-2xl shadow"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
            </div>

            <div className="p-6 space-y-4">
              {activities.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.type === "success"
                        ? "bg-green-100"
                        : item.type === "warning"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        item.type === "success"
                          ? "text-green-600"
                          : item.type === "warning"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>

                    <p className="text-sm text-gray-500">{item.text}</p>

                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />

                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
