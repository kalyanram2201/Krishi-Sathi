import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  Leaf,
  RefreshCw,
} from "lucide-react";

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const onFileChange = (e) => {
    const img = e.target.files?.[0];
    if (img) {
      setFile(img);
      setImageUrl(URL.createObjectURL(img));
      setOutput(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;

    try {
      setLoading(true);

      setOutput(null);

      const formData = new FormData();

      formData.append("image", file);

      const user = JSON.parse(localStorage.getItem("user"));

      const token = user?.token;

      const response = await axios.post(
        "http://localhost:5000/disease/predict",

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data;

      const diseaseName = data.disease;

      const confidence = (data.confidence * 100).toFixed(2);

      let severity = "medium";

      let color = "yellow";

      if (confidence > 90) {
        severity = "high";

        color = "red";
      } else if (confidence > 75) {
        severity = "medium";

        color = "yellow";
      } else {
        severity = "low";

        color = "green";
      }

      const treatmentDatabase = {
        Mango_Gall_Midge: {
          organic: [
            "Remove infected leaves",

            "Use neem oil spray",

            "Improve orchard hygiene",

            "Encourage natural predators",
          ],

          chemical: [
            "Apply Dimethoate spray",

            "Use recommended insecticides",

            "Spray during early infestation",
          ],
        },

        Rice_Blast: {
          organic: [
            "Use resistant rice varieties",

            "Maintain field drainage",

            "Avoid excess nitrogen",
          ],

          chemical: ["Apply Tricyclazole", "Use fungicide spray"],
        },

        Tomato_Early_Blight: {
          organic: [
            "Remove infected leaves",

            "Use crop rotation",

            "Apply compost mulch",
          ],

          chemical: ["Use Mancozeb spray", "Apply Chlorothalonil"],
        },
      };

      const treatments = treatmentDatabase[diseaseName] || {
        organic: [
          "Maintain proper irrigation",

          "Remove infected parts",

          "Ensure crop hygiene",
        ],

        chemical: [
          "Consult local agriculture expert",

          "Use recommended fungicide/pesticide",
        ],
      };

      setOutput({
        disease: diseaseName,

        confidence,

        severity,

        color,

        treatments,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImageUrl("");
    setOutput(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Crop Disease Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo of your crop leaves for instant disease
            identification and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UPLOAD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Upload Crop Image
            </h2>

            {!imageUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">Drop your image here</p>
                <p className="text-sm text-gray-500">or click to browse</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Crop"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {!output && !loading && (
                  <button
                    onClick={analyzeImage}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    Analyze Crop Health
                  </button>
                )}

                {loading && (
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="animate-spin mx-auto h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-blue-700 font-medium">
                      Analyzing image...
                    </p>
                    <p className="text-blue-600 text-sm">
                      AI is examining your crop
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* RESULT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Analysis Results
            </h2>

            {!output ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Upload an image to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-lg border-l-4 ${
                    output.color === "green"
                      ? "bg-green-50 border-green-500"
                      : output.color === "yellow"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-red-50 border-red-500"
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-lg">{output.disease}</h3>
                    {output.disease === "Healthy" ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>

                  <p className="text-sm">
                    Confidence:{" "}
                    <span className="font-medium">{output.confidence}%</span>
                  </p>

                  {output.severity !== "none" && (
                    <p className="text-sm">
                      Severity:{" "}
                      <span
                        className={`font-medium ${
                          output.severity === "high"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {output.severity}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">
                      🌱 Organic Treatments
                    </h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {output.treatments.organic.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">
                      🧪 Chemical Treatments
                    </h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {output.treatments.chemical.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="w-full bg-gray-600 text-white py-2 rounded-lg"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
