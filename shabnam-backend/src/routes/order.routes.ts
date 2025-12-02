import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";
import { protectAdmin } from "../middleware/authMiddleware";
import { orderLimiter, strictApiLimiter } from "../middleware/rateLimit"; // ✅ Import limiters

const router = express.Router();

// ===== USER ROUTES =====
// ✅ Apply order limiter to order creation (prevent spam)
router.post("/", protect, orderLimiter, createOrder);

// ✅ Apply strict limiter to order history (prevent excessive queries)
router.get("/myorders", protect, strictApiLimiter, getMyOrders);

// ===== ADMIN ROUTES =====
router.get("/:id", protectAdmin, getOrderById);
router.put("/:id/deliver", protectAdmin, markOrderAsDelivered);
router.put("/:id/pay", protectAdmin, markOrderAsPaid);

export default router;
