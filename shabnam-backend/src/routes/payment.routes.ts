import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import dotenv from "dotenv";

dotenv.config(); // Ensure env is loaded

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;
