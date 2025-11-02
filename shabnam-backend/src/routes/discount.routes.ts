import express from "express";
import {
  createDiscount,
  getDiscounts
} from "../controllers/discountController";
import { protectAdmin, isSuperAdmin } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/",protectAdmin, createDiscount);
router.get("/", getDiscounts);

export default router;
