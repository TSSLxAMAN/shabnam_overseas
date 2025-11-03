import { Request, Response } from "express";
import Trade from "../models/trade.model";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

// Register Trade User
export const registerTrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      country,
      password,
    } = req.body;

    // Check if email already exists
    const existingTrade = await Trade.findOne({ email });
    if (existingTrade) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Create new Trade user
    const tradeUser = new Trade({
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      country,
      password, // ⚠️ In production, hash this with bcrypt
    });

    await tradeUser.save();

    res.status(201).json({
      message: "Trade access request submitted successfully",
      data: tradeUser,
    });
  } catch (error: any) {
    // console.error("Error registering trade user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Trade Users (Admin only)
export const getAllTrades = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    res.status(200).json(trades);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTraderById = async (req: Request, res: Response) => {
  try {
    const trader = await Trade.findById(req.params.id).select("-password");
    if (!trader) {
      return res.status(404).json({ message: "Trader not found" });
    }
    res.json(trader);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trader", error });
  }
};

// Approve Trade User (Admin)
export const approveTrade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tradeUser = await Trade.findByIdAndUpdate(
      id,
      { tradeStatus: "approved", isApproved: true, approvedAt: new Date() },
      { new: true }
    );

    if (!tradeUser) {
      res.status(404).json({ message: "Trade user not found" });
      return;
    }

    // 🔹 Check if a user already exists with this email
    let user = await User.findOne({ email: tradeUser.email });

    if (user) {
      // Update existing user directly without pre-save hook
      await User.updateOne(
        { _id: user._id },
        {
          name: `${tradeUser.firstName} ${tradeUser.lastName}`,
          password: tradeUser.password, // already hashed
          role: "trader",
          isVerified: true,
        }
      );
    } else {
      // Create new user without triggering pre-save hook
      await User.collection.insertOne({
        name: `${tradeUser.firstName} ${tradeUser.lastName}`,
        email: tradeUser.email,
        password: tradeUser.password, // already hashed
        role: "trader",
        isVerified: true,
        wishlist: [],
        cart: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }



    res.status(200).json({
      message: "Trade user approved successfully and added to User model",
      data: tradeUser,
    });
  } catch (error: any) {
    // console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Unverify Trader (Block Access)
export const unverifyTrade = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const tradeUser = await Trade.findByIdAndUpdate(
      id,
      {
        tradeStatus: "pending", // use "pending" to match your schema enum
        isApproved: false,
        approvedAt: null,
      },
      { new: true }
    );

    if (!tradeUser) {
      res.status(404).json({ message: "Trade user not found" });
      return;
    }

    // ✅ Set isVerified to false in User model if exists
    const user = await User.findOne({ email: tradeUser.email });
    if (user) {
      user.isVerified = false;
      await user.save();
    }

    res.status(200).json({
      message: "Trade user unverified successfully (access blocked)",
      data: tradeUser,
    });
  } catch (error: any) {
    // console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
