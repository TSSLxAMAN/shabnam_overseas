import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
} from "../controllers/order.controller";

import {
  loginAdmin,
  registerAdmin,
  getAdminProfile,
  getAllAdmins,
  updateAdminById,
  deleteAdminById,
} from "../controllers/admin.controller";
import {
  getAllTrades,
  getTraderById,
  approveTrade,
  unverifyTrade
} from "../controllers/trade.controller";

import { protect } from "../middleware/auth.middleware";
import { protectAdmin } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

// ✅ Admin Auth Routes
router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.get("/profile", protectAdmin, getAdminProfile);
router.post(
  "/create-admin",
  protectAdmin,
  checkRole(["superadmin"]),
  registerAdmin
);

// ✅ Superadmin-only Admin Management
router.get("/admins", protectAdmin, checkRole(["superadmin"]), getAllAdmins);
router.put(
  "/admins/:id",
  protectAdmin,
  checkRole(["superadmin"]),
  updateAdminById
);
router.delete(
  "/admins/:id",
  protectAdmin,
  checkRole(["superadmin"]),
  deleteAdminById
);

// 👉 Orders (User or Admin)
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// 👉 Admin-only Orders
router.get("/orders", protectAdmin, getAllOrders);
router.get("/orders/:id", protectAdmin, getOrderById);
router.put("/orders/:id/deliver", protectAdmin, markOrderAsDelivered);

router.put("/:id/pay", protectAdmin, markOrderAsPaid);

router.get(
  "/traders",
  protectAdmin,
  checkRole(["admin", "superadmin"]),
  getAllTrades
);
router.get(
  "/traders/:id",
  protectAdmin,
  checkRole(["admin", "superadmin"]),
  getTraderById
);
router.put(
  "/traders/:id/verify",
  protectAdmin,
  checkRole(["admin", "superadmin"]),
  approveTrade
);
router.put(
  "/traders/:id/unverify",
  protectAdmin,
  checkRole(["admin", "superadmin"]),
  unverifyTrade
);

export default router;
