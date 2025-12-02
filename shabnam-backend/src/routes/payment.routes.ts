import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import { paymentLimiter } from "../middleware/rateLimit"; // ✅ Import payment limiter
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// ✅ Apply payment limiter to both routes
router.post("/create-order", paymentLimiter, createOrder);
router.post("/verify", paymentLimiter, verifyPayment);

export default router;
