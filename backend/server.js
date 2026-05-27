import express from "express";
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://krishi-sathi-phi.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/weather", weatherRoutes);
app.use("/crop", cropRoutes);
app.use("/predictions", predictionRoutes);
app.use("/disease", diseaseRoutes);
app.use("/users", userRoutes);
app.use(
  "/uploads",

  express.static(
    path.join(
      __dirname,

      "uploads",
    ),
  ),
);
// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
