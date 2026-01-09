import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import User from "../models/User.js";

const router = express.Router();

// Upload profile picture
router.post(
  "/upload-profile-pic",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      // Cloudinary image URL
      user.profilePic = req.file.path;
      await user.save();

      res.json({
        msg: "Profile picture updated",
        profilePic: user.profilePic,
      });
    } catch (err) {
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);

export default router;
