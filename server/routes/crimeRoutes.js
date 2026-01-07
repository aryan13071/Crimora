import express from "express";
import  {reportCrime } from "../controllers/crimeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/report", authMiddleware, reportCrime);

export default router;
