import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import sendEmail from "../utils/sendEmail";
import Product from "../models/product.model";
import Order from "../models/order.model";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

// Define interfaces for request types
interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

interface ResetPasswordRequest extends Request {
  params: {
    token: string;
  };
  body: {
    password: string;
  };
}

interface VerifyResetTokenRequest extends Request {
  params: {
    token: string;
  };
}

interface AddToWishlistRequest extends AuthRequest {
  params: {
    productId: string;
  };
}

interface RemoveFromWishlistRequest extends AuthRequest {
  params: {
    productId: string;
  };
}

interface UpdateProfileRequest extends AuthRequest {
  body: {
    name?: string;
    email?: string;
    password?: string;
  };
}

// JWT Token generator
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
export const registerUser = asyncHandler(
  async (req: RegisterRequest, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = (await User.create({ name, email, password })) as any; // Type casting

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  }
);

// Login
export const loginUser = asyncHandler(
  async (req: LoginRequest, res: Response) => {
    const { email, password } = req.body;

    const user = (await User.findOne({ email })) as any; // Type casting

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // ✅ Check if user is verified (for traders)
    if (user.role === "trader" && !user.isVerified) {
      res.status(403);
      throw new Error("Trader account is not verified yet");
    }

    // Return user info with role and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  }
);

// Forgot Password
export const forgotPassword = asyncHandler(
  async (req: ForgotPasswordRequest, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${rawToken}`;
    const html = `
    <p>Hello ${user.name},</p>
    <p>You requested a password reset. Click below:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 1 hour.</p>
    <p>If not requested, ignore this.</p>
  `;

    await sendEmail(user.email, "Password Reset - Shabnam Overseas", html);
    res.json({ message: "Reset link sent to email" });
  }
);

// Verify Token
export const verifyResetToken = asyncHandler(
  async (req: VerifyResetTokenRequest, res: Response) => {
    const resetToken = req.params.token;
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired token");
    }

    res.status(200).json({ message: "Token is valid" });
  }
);

// Reset Password
export const resetPassword = asyncHandler(
  async (req: ResetPasswordRequest, res: Response) => {
    const resetToken = req.params.token;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  }
);

// @desc    Get logged-in user's profile + order history
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const user = await User.findById(req.user._id).select("-password");

    const orders = await Order.find({ user: req.user._id, isPaid: true })
      .populate("orderItems.product", "name price image")
      .sort({ createdAt: -1 });

    if (user) {
      res.json({ user, orders });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(
  async (req: UpdateProfileRequest, res: Response) => {
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  }
);

export const getWishlist = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user.wishlist);
});

export const addToWishlist = asyncHandler(async (req: AddToWishlistRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if already in wishlist
  const isAlreadyWishlisted = user.wishlist.some(
    (id) => id.toString() === productId
  );

  if (isAlreadyWishlisted) {
    res.status(400);
    throw new Error("Product already in wishlist");
  }

  // Add to wishlist
  user.wishlist.push(new mongoose.Types.ObjectId(productId));

  // ✅ Only validate the modified fields, not the entire document
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    message: "Product added to wishlist",
    wishlist: user.wishlist,
  });
});

export const removeFromWishlist = asyncHandler(async (req: RemoveFromWishlistRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if product is in wishlist
  const isInWishlist = user.wishlist.some((id) => id.toString() === productId);

  if (!isInWishlist) {
    res.status(400);
    throw new Error("Product not found in wishlist");
  }

  // Remove the product
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

  // ✅ Only validate the modified fields
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    message: "Product removed from wishlist",
    wishlist: user.wishlist,
  });
});