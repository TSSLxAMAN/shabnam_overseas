import express from "express";
import {
  filterProducts,
  getFilterOptions,
} from "../controllers/productFilterController";

const router = express.Router();

// GET /api/filter/products?filter=style:MODERN
// GET /api/filter/products?filter=byType:HAND-KNOTTED
// GET /api/filter/products?filter=MODERN (searches all fields)
router.get("/products", filterProducts);

// GET /api/filter/options - get all available filter values
router.get("/options", getFilterOptions);

export default router;
