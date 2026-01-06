


import express from "express"; 
// 🔴 SORRY: CHANGE MADE HERE

import { signup, login } from "../controllers/authController.js"; 
// 🔴 SORRY: CHANGE MADE HERE

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router; 
// 🔴 SORRY: CHANGE MADE HERE (already correct export)
