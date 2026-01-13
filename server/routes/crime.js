import express from "express";
import Crime from "../models/Crime.js";

const router = express.Router();

router.get("/reported", async (req, res) => {
  const crimes = await Crime.find()
    .populate("user", "email profilePic");

  res.json(crimes);
});

export default router;
