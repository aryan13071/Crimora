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
import crimeRoutes from "./routes/crimeRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import chatRt from "./routes/chat.rt.js";







import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


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


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));
  console.log(` AAA>>...>>>AAA see the token ${token}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

// io.on("connection", (socket) => {
//   console.log("✅ Socket connected:", socket.userId);

//   socket.on("join_room", (crimeId) => {
//     socket.join(crimeId);
//   });

//   socket.on("send_message", async ({ receiver, crimeId, text }) => {
//     const msg = await Message.create({
//       sender: socket.userId,
//       receiver,
//       crime: crimeId,
//       text,
//     });

//     io.to(crimeId).emit("receive_message", msg);
//   });
// });


io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.userId);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", ({ room, text }) => {
    io.to(room).emit("receive_message", {
      text,
      sender: socket.userId,
    });
  });
});





// Base route
app.get("/", (req, res) => {
  res.send("✅ Crimora backend is running!");
});

// ===================== AUTH ROUTES ===================== // 🔴 ADDED
app.use("/api/auth", authRoutes);
app.use("/api/crime", crimeRoutes);
app.use("/api/user", userRoutes);
app.get("/api/messages/:crimeId", async (req, res) => {
  const msgs = await Message.find({ crime: req.params.crimeId })
    .sort({ createdAt: 1 });
  res.json(msgs);
});

app.use("/api/chat", chatRt);



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
server.listen(PORT, () => {
  console.log(`🚀 Crimora backend + Socket.IO running on port ${PORT}`);
});

