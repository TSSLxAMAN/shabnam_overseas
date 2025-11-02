// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit to 5 requests per IP
  message: {
    message: 'Too many reset requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export default forgotPasswordLimiter;