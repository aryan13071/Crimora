// server/index.js

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:3000", // React dev server
  })
);

// Base route
app.get("/", (req, res) => {
  res.send("✅ Crimora backend is running!");
});

// Crime data route
app.get("/api/crime", async (req, res) => {
  const { lat, lng, date } = req.query;

  // Validate query params
  if (!lat || !lng || !date) {
    return res.status(400).json({ error: "Missing lat/lng/date" });
  }

  try {
    const apiURL = `https://data.police.uk/api/crimes-street/all-crime?date=${date}&lat=${lat}&lng=${lng}`;

    // Fetch from UK Police API with User-Agent
    const response = await fetch(apiURL, {
      headers: {
        "User-Agent": "Crimora-App (coderaryan2005@gmail.com)",
        "Accept": "application/json"
      }
    });

    // Handle non-200 responses
    if (!response.ok) {
      console.warn(`Police API returned ${response.status} for ${lat},${lng}`);
      return res.json([]); // return empty array instead of error
    }

    const data = await response.json();
    res.json(data || []);
  } catch (error) {
    console.error(`Failed to fetch crime data at ${lat},${lng}:`, error.message);
    res.json([]); // return empty array instead of 500
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Crimora backend running on port ${PORT}`);
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get('/:path(*)', (req, res) => {
    res.send('Not Found');
  });
}
