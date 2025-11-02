import { Request, Response } from "express";
import Discount from "../models/discount";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const createDiscount = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { discount } = req.body;

    if (discount === undefined || discount === null) {
      res.status(400).json({
        success: false,
        message: "Discount value is required",
      });
      return;
    }

    const numericDiscount =
      typeof discount === "string" ? parseFloat(discount) : discount;

    if (isNaN(numericDiscount)) {
      res.status(400).json({
        success: false,
        message: "Discount must be a number",
      });
      return;
    }

    if (numericDiscount < 0 || numericDiscount > 100) {
      res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 100",
      });
      return;
    }

    const newDiscount = new Discount({ value: numericDiscount });
    await newDiscount.save();

    res.status(201).json({
      success: true,
      message: "Discount saved successfully",
      data: newDiscount,
    });
  } catch (error) {
    console.error("Error saving discount:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getDiscounts = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Discounts retrieved successfully",
      data: discounts,
    });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
