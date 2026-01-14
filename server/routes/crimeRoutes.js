import express from "express";
import {
  reportCrime,
  getAllCrimes
} from "../controllers/crimeController.js";
import Crime from "../models/Crime.js"
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/report", authMiddleware, reportCrime);

/**
 * GET /api/crime/all
 * Public route
 * Anyone can fetch crime data
 */
router.get("/all", getAllCrimes);
router.get("/reported", getAllCrimes);

router.get("/:id", async (req, res) => {
  try {
    const crime = await Crime.findById(req.params.id);
    console.log("Crime details at the id ?? :", crime);
    res.json(crime);
    
  } catch (err) {
    res.status(500).json({ msg: "Crime not found" });
  }
});

export default router;
