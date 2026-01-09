import express from "express"; 
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
// 🔴 SORRY: CHANGE MADE HERE

import { signup, login } from "../controllers/authController.js"; 
// 🔴 SORRY: CHANGE MADE HERE

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user contains user id (set by authMiddleware)
    const user = await User.findById(req.user.id).select("-password");

    // If user not found
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send user data to frontend
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router; 
// 🔴 SORRY: CHANGE MADE HERE (already correct export)
