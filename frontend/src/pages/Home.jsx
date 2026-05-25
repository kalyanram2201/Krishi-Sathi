import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Brain,
  CloudRain,
  ShoppingBag,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Disease Detection",
      text: "Upload crop photos for instant disease identification and treatment recommendations.",
      path: "/disease-detection",
    },
    {
      icon: Leaf,
      title: "Smart Crop Suggestions",
      text: "Get personalized crop recommendations based on soil conditions and climate.",
      path: "/crop-suggestion",
    },
    {
      icon: CloudRain,
      title: "Weather Forecasts",
      text: "Real-time weather updates and risk alerts for better farm planning.",
      path: "/weather",
    },
    {
      icon: ShoppingBag,
      title: "Agri Marketplace",
      text: "Buy and sell seeds, fertilizers, and farming tools in our integrated marketplace.",
      path: "/marketplace",
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Active Farmers" },
    { icon: TrendingUp, value: "95%", label: "Accuracy Rate" },
    { icon: Shield, value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Agriculture
              <span className="text-green-600 block">Platform</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionize your farming with AI-powered crop disease detection,
              smart recommendations, and complete agricultural solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-green-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                to="/marketplace"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50"
              >
                Explore Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Agricultural Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed decisions and increase farm
              productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl"
              >
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-green-600" />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.text}</p>

                <Link
                  to={item.path}
                  className="text-green-600 font-medium inline-flex items-center hover:text-green-700"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-white"
              >
                <div className="flex justify-center mb-4">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">
                  {item.value}
                </div>
                <div className="text-green-100">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers using AgriSmart to increase productivity
            and reduce risks.
          </p>

          <Link
            to="/dashboard"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center text-lg hover:bg-green-700"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
