import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts,
} from "../controllers/product.controller";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Place more specific routes first
router.get("/filter", getFilteredProducts); // <-- move this ABOVE "/:id"
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin-only
router.post("/", protectAdmin, createProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
