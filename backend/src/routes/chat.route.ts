import { Router } from "express";
import {
  createChatResponseController,
  getChatHistoryController,
} from "../controllers/chat.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";
import { blockPromptInjection } from "../middleware/prompt-injection.middleware.js";
import { chatRateLimiter } from "../middleware/rate-limit.middleware.js";

export const chatRouter = Router();

chatRouter.post("/", chatRateLimiter, blockPromptInjection, asyncHandler(createChatResponseController));
chatRouter.get("/history/:sessionId", asyncHandler(getChatHistoryController));
