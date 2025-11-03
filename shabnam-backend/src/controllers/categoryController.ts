import { Request, Response } from "express";
import { Category } from "../models/category";

// GET /categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// POST /categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const existing = await Category.findOne({ name: name.trim(), type });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await Category.create({ name: name.trim(), type });
    res.status(201).json(newCategory);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// DELETE /categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
