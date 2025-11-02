import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController";
import { protectAdmin, isSuperAdmin } from "../middleware/auth.middleware";
import { getAllProducts } from "../controllers/product.controller";
import { getAllOrders } from "../controllers/order.controller";
import { getFilteredProducts } from "../controllers/product.controller";

const router = express.Router();

router.post("/login", loginAdmin);
// router.post('/register', protectAdmin, isSuperAdmin, registerAdmin);
router.post("/register", registerAdmin); // TEMP: allow public superadmin registration
router.get("/products", protectAdmin, getFilteredProducts); // ⬅️ Must use updated controller
    
export default router;
