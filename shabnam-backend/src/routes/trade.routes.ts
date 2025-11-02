import { Router } from "express";
import {
  registerTrade,
  getAllTrades,
  approveTrade,
} from "../controllers/trade.controller";

const router = Router();

// Public route: Register new trade user
router.post("/register", registerTrade);

// Admin routes
router.get("/", getAllTrades);
router.put("/:id/approve", approveTrade);

export default router;
