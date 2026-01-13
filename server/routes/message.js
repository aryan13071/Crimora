import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:crimeId", authMiddleware, async (req, res) => {
  const messages = await Message.find({
    crime: req.params.crimeId,
  }).populate("sender", "email profilePic");

  res.json(messages);
});

export default router;
