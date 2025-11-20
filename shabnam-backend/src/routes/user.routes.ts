import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail, // ✅ Add this import
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  resendVerificationEmail,
} from "../controllers/user.controller";
import forgotPasswordLimiter from "../middleware/rateLimit";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Email verification
router.get("/verify-email/:token", verifyEmail); 
router.post("/resend-verification", resendVerificationEmail); // ✅ Add this route

// ✅ Add this route

// Password reset
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);
router.put("/reset-password/:token", resetPassword);

// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

export default router;
