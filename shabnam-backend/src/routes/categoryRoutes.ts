import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protectAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// ✅ GET all categories
router.get("/", protectAdmin, getCategories);

// ✅ POST create new category
router.post("/", protectAdmin, createCategory);

// ✅ DELETE a category by ID
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
