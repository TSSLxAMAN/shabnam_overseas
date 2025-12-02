// src/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";

// ===== AUTH RATE LIMITERS =====

// Registration rate limiter - prevents spam account creation
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit to 5 registration attempts per IP per hour
  message: {
    message:
      "Too many accounts created from this IP. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limiter - prevents brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit to 10 login attempts per IP
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password rate limiter - prevents email spam
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 5 requests per IP
  message: {
    message: "Too many reset requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email verification resend limiter - prevents email spam
export const resendVerificationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit to 3 resend attempts
  message: {
    message:
      "Too many verification email requests. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== API RATE LIMITERS =====

// General API rate limiter - applies to all API routes
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit to 100 requests per IP
  message: {
    message:
      "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict API limiter - for sensitive operations
export const strictApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit to 20 requests per IP
  message: {
    message: "Rate limit exceeded. Please slow down your requests.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== CART & WISHLIST RATE LIMITERS =====

// Cart modification limiter - prevents cart spam
export const cartLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // limit to 30 cart operations
  message: {
    message: "Too many cart operations. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Wishlist modification limiter
export const wishlistLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // limit to 30 wishlist operations
  message: {
    message: "Too many wishlist operations. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== ORDER RATE LIMITER =====

// Order creation limiter - prevents order spam
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit to 10 orders per hour
  message: {
    message: "Too many orders placed. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== PAYMENT RATE LIMITER =====

// Payment operations limiter - prevents payment fraud
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit to 20 payment operations
  message: {
    message: "Too many payment requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== APPOINTMENT RATE LIMITER =====

// Appointment booking limiter - prevents appointment spam
export const appointmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit to 5 appointments per hour
  message: {
    message: "Too many appointment requests. Please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== ADMIN AUTH RATE LIMITER =====

// Admin login limiter - strict protection for admin panel
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 5 login attempts (stricter than user login)
  message: {
    message:
      "Too many admin login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin registration limiter - prevent unauthorized admin creation
export const adminRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit to 3 registration attempts per hour
  message: {
    message: "Too many admin registration attempts. Please contact support.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Default export for backward compatibility
export default forgotPasswordLimiter;
