import { Request, Response } from "express";
import Product from "../models/product.model";

// Define valid filter fields based on your schema
const VALID_FILTER_FIELDS = ["style", "byType", "byRoom", "category"];

// Define interfaces for request queries
interface FilterProductsRequest extends Request {
  query: {
    filter?: string;
  };
}

interface AdvancedFilterRequest extends Request {
  query: {
    styles?: string | string[];
    types?: string | string[];
    rooms?: string | string[];
    categories?: string | string[];
    colors?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  };
}

export const filterProducts = async (
  req: FilterProductsRequest,
  res: Response
) => {
  try {
    const { filter } = req.query;

    // If no filter parameter, return all products
    if (!filter) {
      const products = await Product.find({});
      return res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    }

    // Validate the filter parameter type
    if (typeof filter !== "string") {
      return res.status(400).json({
        success: false,
        message: "Filter parameter must be a string",
      });
    }

    // Parse the filter string (format: "FIELD:VALUE" or just "VALUE")
    let fieldName = "";
    let value = "";

    if (filter.includes(":")) {
      // Format: "FIELD:VALUE"
      const parts = filter.split(":");
      fieldName = parts[0];
      value = parts.slice(1).join(":"); // In case value contains colons

      // Validate field name
      if (!VALID_FILTER_FIELDS.includes(fieldName) && fieldName !== "color") {
        return res.status(400).json({
          success: false,
          message: `Invalid filter field. Valid fields are: ${VALID_FILTER_FIELDS.join(
            ", "
          )}, color`,
        });
      }
    } else {
      // Format: "VALUE" - we need to try all possible fields
      value = filter;
    }

    // Build the query
    let query = {};

    if (fieldName) {
      if (fieldName === "color") {
        // Special handling for color filter (array of objects)
        query = { "colors.label": { $regex: new RegExp(value, "i") } };
      } else {
        // Specific field query (case-insensitive)
        query = { [fieldName]: { $regex: new RegExp(value, "i") } };
      }
    } else {
      // Search across all valid fields (case-insensitive)
      // Also include color search
      query = {
        $or: [
          ...VALID_FILTER_FIELDS.map((field) => ({
            [field]: { $regex: new RegExp(value, "i") },
          })),
          { "colors.label": { $regex: new RegExp(value, "i") } },
        ],
      };
    }

    // Execute query
    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    // console.error("Filter products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while filtering products",
    });
  }
};

// Get all available filter values for frontend
export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    // Remove null/undefined values from distinct results
    const styles = (await Product.distinct("style")).filter(
      Boolean
    ) as string[];
    const types = (await Product.distinct("byType")).filter(
      Boolean
    ) as string[];
    const rooms = (await Product.distinct("byRoom")).filter(
      Boolean
    ) as string[];
    const categories = (await Product.distinct("category")).filter(
      Boolean
    ) as string[];

    // For colors, we need to get distinct values from the colors.label array
    const colorResults = await Product.aggregate([
      { $unwind: "$colors" },
      { $group: { _id: "$colors.label" } },
      { $match: { _id: { $ne: null } } },
    ]);
    const colors = colorResults
      .map((item) => item._id)
      .filter(Boolean) as string[];

    res.status(200).json({
      success: true,
      options: {
        styles,
        types,
        rooms,
        categories,
        colors,
      },
    });
  } catch (error) {
    // console.error("Get filter options error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching filter options",
    });
  }
};

// Get products with multiple filters (advanced filtering)
export const advancedFilterProducts = async (
  req: AdvancedFilterRequest,
  res: Response
) => {
  try {
    const { styles, types, rooms, categories, colors, minPrice, maxPrice } =
      req.query;

    // Build query object
    const query: any = {};

    // Helper function to process array or single values
    const processFilter = (
      filterValue: string | string[] | undefined,
      field: string
    ) => {
      if (!filterValue) return;

      const filterArray = Array.isArray(filterValue)
        ? filterValue
        : [filterValue];

      query[field] = {
        $in: filterArray.map((item: string) => new RegExp(item, "i")),
      };
    };

    // Add filters if they exist
    processFilter(styles, "style");
    processFilter(types, "byType");
    processFilter(rooms, "byRoom");
    processFilter(categories, "category");

    // Handle colors filter (nested field)
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      query["colors.label"] = {
        $in: colorArray.map((c: string) => new RegExp(c, "i")),
      };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query["sizes.price"] = {};
      if (minPrice) query["sizes.price"].$gte = Number(minPrice);
      if (maxPrice) query["sizes.price"].$lte = Number(maxPrice);
    }

    // Execute query
    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    // console.error("Advanced filter products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while filtering products",
    });
  }
};
