import express from "express";
import { chat } from "../controllers/chat.ctrl.js";

const router = express.Router();

router.post("/", chat);

export default router;
