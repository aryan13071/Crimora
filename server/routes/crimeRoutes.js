import express from "express";
import {
  reportCrime,
  getAllCrimes
} from "../controllers/crimeController.js";
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
export default router;
