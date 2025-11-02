import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/product.model";
import mongoose from "mongoose";

// Define interfaces for request parameters and query
interface GetProductByIdRequest extends Request {
  params: {
    id: string;
  };
}

interface FilteredProductsRequest extends Request {
  query: {
    search?: string;
    category?: string;
    size?: string;
    sort?: string;
    page?: string;
    limit?: string;
    byType?: string;
    byRoom?: string;
    byColor?: string;
    style?: string;
  };
}

interface CreateProductRequest extends Request {
  body: {
    name: string;
    description: string;
    image: string[];
    category: string;
    price?: number;
    countInStock?: number;
    sizes: Array<{ label: string; price: number; stock: number }>;
    byType?: string;
    byRoom?: string;
    colors: Array<{ label: string }>;
    style?: string;
    // New fields
    dimensions?: string;
    material?: string;
    careInformation?: string;
    additionalDetails?: string;
    shippingReturns?: string;
  };
}

interface UpdateProductRequest extends Request {
  params: {
    id: string;
  };
  body: {
    name?: string;
    description?: string;
    image?: string[];
    category?: string;
    sizes?: Array<{ label: string; price: number; stock: number }>;
    colors?: Array<{ label: string }>;
    byType?: string;
    byRoom?: string;
    style?: string;
    // New fields
    dimensions?: string;
    material?: string;
    careInformation?: string;
    additionalDetails?: string;
    shippingReturns?: string;
  };
}

interface DeleteProductRequest extends Request {
  params: {
    id: string;
  };
}

// ✅ GET all products (admin) with filters, search, pagination
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      search,
      category,
      size,
      sort = "newest",
      page = "1",
      limit = "12",
    } = req.query as {
      search?: string;
      category?: string;
      size?: string;
      sort?: string;
      page?: string;
      limit?: string;
    };

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (size) {
      query.size = size;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "priceLow") sortOption = { price: 1 };
    if (sort === "priceHigh") sortOption = { price: -1 };

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 12;

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    });
  }
);

// 🆕 CREATE product
export const createProduct = asyncHandler(
  async (req: CreateProductRequest, res: Response) => {
    const {
      name,
      description,
      image,
      category,
      price,
      countInStock,
      sizes,
      byType,
      byRoom,
      colors,
      style,
      // New fields
      dimensions,
      material,
      careInformation,
      additionalDetails,
      shippingReturns,
    } = req.body;

    if (!Array.isArray(image) || image.length === 0) {
      res.status(400).json({ message: "At least one image is required" });
      return;
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      res.status(400).json({ message: "At least one size option is required" });
      return;
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      res
        .status(400)
        .json({ message: "At least one color option is required" });
      return;
    }

    const newProduct = new Product({
      name,
      description,
      image,
      category,
      price,
      countInStock,
      sizes,
      byType,
      byRoom,
      colors,
      style,
      // New fields
      dimensions: dimensions || "",
      material: material || "",
      careInformation: careInformation || "",
      additionalDetails: additionalDetails || "",
      shippingReturns: shippingReturns || "",
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  }
);

// ✏️ UPDATE product
export const updateProduct = asyncHandler(
  async (req: UpdateProductRequest, res: Response) => {
    const { id } = req.params;
    const {
      name,
      description,
      image,
      category,
      sizes,
      colors,
      byType,
      byRoom,
      style,
      // New fields
      dimensions,
      material,
      careInformation,
      additionalDetails,
      shippingReturns,
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (!Array.isArray(image) || image.length === 0) {
      res.status(400).json({ message: "At least one image is required" });
      return;
    }

    if (!Array.isArray(sizes) || sizes.length === 0) {
      res.status(400).json({ message: "At least one size option is required" });
      return;
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      res
        .status(400)
        .json({ message: "At least one color option is required" });
      return;
    }

    // Validate sizes format
    for (const size of sizes!) {
      if (!size.label || !size.price || size.stock === undefined) {
        res.status(400).json({
          message: "Each size must have label, price, and stock",
        });
        return;
      }

      const allowedSizes = ["2x3", "3x5", "4x6", "5x8", "6x9"];
      if (!allowedSizes.includes(size.label)) {
        res.status(400).json({
          message: `Invalid size label: ${
            size.label
          }. Allowed sizes: ${allowedSizes.join(", ")}`,
        });
        return;
      }

      if (isNaN(Number(size.price)) || isNaN(Number(size.stock))) {
        res.status(400).json({
          message: "Price and stock must be valid numbers",
        });
        return;
      }
    }

    // Validate colors format
    for (const color of colors!) {
      if (!color.label) {
        res.status(400).json({
          message: "Each color must have a label",
        });
        return;
      }

      const allowedColors = ["RED", "BLUE", "BEIGE", "GREEN", "GREY"];
      if (!allowedColors.includes(color.label)) {
        res.status(400).json({
          message: `Invalid color label: ${
            color.label
          }. Allowed colors: ${allowedColors.join(", ")}`,
        });
        return;
      }
    }

    // Build update object with all fields
    const updateData: any = {
      name,
      description,
      image,
      category,
      sizes: sizes!.map((size) => ({
        label: size.label,
        price: Number(size.price),
        stock: Number(size.stock),
      })),
      colors,
      byType,
      byRoom,
      style,
      // Always include new fields (even if empty strings)
      dimensions: dimensions || "",
      material: material || "",
      careInformation: careInformation || "",
      additionalDetails: additionalDetails || "",
      shippingReturns: shippingReturns || "",
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  }
);

// ❌ DELETE product
export const deleteProduct = asyncHandler(
  async (req: DeleteProductRequest, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }
);

export const getFilteredProducts = asyncHandler(
  async (req: FilteredProductsRequest, res: Response) => {
    const {
      search,
      category,
      size,
      sort,
      page = "1",
      limit = "12",
      byType,
      byRoom,
      byColor,
      style,
    } = req.query;

    console.log("📩 Incoming /products request");
    console.log("👉 Raw query params:", req.query);

    const query: any = {};

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category.trim()) {
      query.category = { $regex: new RegExp(category.trim(), "i") };
    }

    if (size && size.trim()) {
      query["sizes.label"] = { $regex: new RegExp(size.trim(), "i") };
    }

    if (byColor && byColor.trim()) {
      query["colors.label"] = byColor.trim().toUpperCase();
    }

    if (byType) query.byType = byType.toUpperCase();
    if (byRoom) query.byRoom = byRoom.toUpperCase();
    if (style) query.style = style.toUpperCase();

    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    let sortPipeline: any[] = [];
    sortPipeline.push({ $match: query });

    if (sort === "priceLow" || sort === "priceHigh") {
      sortPipeline.push({
        $addFields: {
          minPrice: { $min: "$sizes.price" },
          maxPrice: { $max: "$sizes.price" },
          avgPrice: { $avg: "$sizes.price" },
        },
      });
    }

    let sortStage: any = {};
    switch (sort) {
      case "newest":
        sortStage = { createdAt: -1 };
        break;
      case "oldest":
        sortStage = { createdAt: 1 };
        break;
      case "priceLow":
        sortStage = { minPrice: 1, name: 1 };
        break;
      case "priceHigh":
        sortStage = { maxPrice: -1, name: 1 };
        break;
      case "name":
        sortStage = { name: 1 };
        break;
      default:
        sortStage = { createdAt: -1 };
    }

    sortPipeline.push({ $sort: sortStage });

    if (limitNum < 9999) {
      sortPipeline.push({ $skip: skip });
      sortPipeline.push({ $limit: limitNum });
    }

    try {
      let products: any[];
      let totalCount: number;

      if (sort === "priceLow" || sort === "priceHigh") {
        const [productsResult, countResult] = await Promise.all([
          Product.aggregate(sortPipeline),
          Product.aggregate([{ $match: query }, { $count: "total" }]),
        ]);

        products = productsResult;
        totalCount = countResult[0]?.total || 0;
      } else {
        const [productsResult, count] = await Promise.all([
          Product.find(query)
            .sort(sortStage)
            .skip(skip)
            .limit(limitNum < 9999 ? limitNum : 0)
            .lean(),
          Product.countDocuments(query),
        ]);

        products = productsResult;
        totalCount = count;
      }

      console.log(
        `Found ${products.length} products out of ${totalCount} total`
      );

      const totalPages = limitNum < 9999 ? Math.ceil(totalCount / limitNum) : 1;
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      const response = {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: limitNum,
        },
        total: totalCount,
        pages: totalPages,
        currentPage: pageNum,
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      res.status(500).json({
        message: "Error fetching products",
        error: process.env.NODE_ENV === "development" ? error : {},
      });
    }
  }
);

// OPTIONAL: Add a separate endpoint to get filter options
export const getFilterOptions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const [categories, sizes, colors] = await Promise.all([
        Product.distinct("category"),
        Product.distinct("sizes.label"),
        Product.distinct("colors.label"),
      ]);

      res.json({
        categories: categories.filter(Boolean).map((c) => c.toLowerCase()),
        sizes: sizes.filter(Boolean).map((s) => s.toLowerCase()),
        colors: colors.filter(Boolean),
      });
    } catch (error) {
      console.error("Error fetching filter options:", error);
      res.status(500).json({
        message: "Error fetching filter options",
        error: process.env.NODE_ENV === "development" ? error : {},
      });
    }
  }
);

// ✅ GET product by ID - FIXED VERSION
export const getProductById = asyncHandler(
  async (req: GetProductByIdRequest, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
