import rateLimit from "express-rate-limit";
import { securityConfig } from "../config/security.config.js";

function createRateLimiter(input: { windowMs: number; max: number; message: string }) {
  return rateLimit({
    windowMs: input.windowMs,
    max: input.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too Many Requests",
      message: input.message,
    },
  });
}

export const generalRateLimiter = createRateLimiter({
  ...securityConfig.generalRateLimit,
  message: "Too many requests. Please try again later.",
});

export const chatRateLimiter = createRateLimiter({
  ...securityConfig.chatRateLimit,
  message: "Too many chat requests. Please slow down and try again.",
});

export const adminRateLimiter = createRateLimiter({
  ...securityConfig.adminRateLimit,
  message: "Too many admin requests. Please try again later.",
});

export const ticketRateLimiter = createRateLimiter({
  ...securityConfig.ticketRateLimit,
  message: "Too many ticket requests. Please try again later.",
});
