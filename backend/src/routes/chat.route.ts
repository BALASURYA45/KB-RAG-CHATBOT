import { Router } from "express";
import {
  createChatResponseController,
  getChatHistoryController,
} from "../controllers/chat.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";

export const chatRouter = Router();

chatRouter.post("/", asyncHandler(createChatResponseController));
chatRouter.get("/history/:sessionId", asyncHandler(getChatHistoryController));
