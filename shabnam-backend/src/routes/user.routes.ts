import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail,
  resendVerificationEmail,
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/user.controller";
import {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
  wishlistLimiter,
  strictApiLimiter,
} from "../middleware/rateLimit";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// ===== AUTH ROUTES (with rate limiters) =====
router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);

// ===== EMAIL VERIFICATION ROUTES =====
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerificationEmail
);

// ===== PASSWORD RESET ROUTES =====
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);
router.put("/reset-password/:token", resetPassword);

// ===== PROFILE ROUTES (protected) =====
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, strictApiLimiter, updateUserProfile);

// ===== WISHLIST ROUTES (protected + rate limited) =====
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, wishlistLimiter, addToWishlist);
router.delete(
  "/wishlist/:productId",
  protect,
  wishlistLimiter,
  removeFromWishlist
);

export default router;
