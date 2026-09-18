// src/middlewares/rateLimiter.ts

import { rateLimit } from "express-rate-limit";

export const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: process.env.NODE_ENV === "production"
    ? 100
    : 1000,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,

  // Successful login requests don't remain counted
  skipSuccessfulRequests: true,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later.",
      code: "LOGIN_RATE_LIMIT_EXCEEDED",
    });
  },
});