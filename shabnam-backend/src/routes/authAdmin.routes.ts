import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controller";
import {
  adminLoginLimiter,
  adminRegisterLimiter,
} from "../middleware/rateLimit"; // ✅ Import admin limiters

const router = express.Router();

// ✅ Apply strict admin login limiter (5 attempts per 15 min)
router.post("/login", adminLoginLimiter, loginAdmin);

// ✅ Apply strict admin register limiter (3 attempts per hour)
router.post("/register", adminRegisterLimiter, registerAdmin);

export default router;
