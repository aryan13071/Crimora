// server/index.js
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import passport from "passport";                 // 🔴 ADDED
import connectDB from "./config/db.js";           // 🔴 ADDED
import authRoutes from "./routes/authRoutes.js";  // 🔴 ADDED
import "./config/passport.js";  // 🔴 ADDED (Google OAuth)







const app = express();
const PORT = process.env.PORT || 5000;

// 🔴 ADDED: MongoDB connection
connectDB();

// 🔴 ADDED: Body parser
app.use(express.json());

console.log(process.env.MONGO_URI);

console.log("yaha par aya par yeh run nhi hua nicche wala ");
console.log("ENV CHECK:", {
  MONGO: process.env.MONGO_URI,
  GOOGLE_ID: process.env.GOOGLE_CLIENT_ID,
});


// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 🔴 ADDED (needed for auth)
  })
);

// 🔴 ADDED: Passport init
app.use(passport.initialize());

// Base route
app.get("/", (req, res) => {
  res.send("✅ Crimora backend is running!");
});

// ===================== AUTH ROUTES ===================== // 🔴 ADDED
app.use("/api/auth", authRoutes);

// 🔴 ADDED: Google OAuth start
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔴 ADDED: Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const jwt = await import("jsonwebtoken"); // ES module safe
    const token = jwt.default.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// ===================== EXISTING CRIME API =====================
app.get("/api/crime", async (req, res) => {
  const { lat, lng, date } = req.query;

  if (!lat || !lng || !date) {
    return res.status(400).json({ error: "Missing lat/lng/date" });
  }

  try {
    const apiURL = `https://data.police.uk/api/crimes-street/all-crime?date=${date}&lat=${lat}&lng=${lng}`;

    const response = await fetch(apiURL, {
      headers: {
        "User-Agent": "Crimora-App (coderaryan2005@gmail.com)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.warn(`Police API returned ${response.status}`);
      return res.json([]);
    }

    const data = await response.json();
    res.json(data || []);
  } catch (error) {
    console.error("Crime API error:", error.message);
    res.json([]);
  }
});

// ===================== PRODUCTION BUILD =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Crimora backend running on port ${PORT}`);
});
