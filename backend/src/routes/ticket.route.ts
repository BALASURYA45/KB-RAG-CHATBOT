import { Router } from "express";
import { createTicketController } from "../controllers/ticket.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";
import { ticketRateLimiter } from "../middleware/rate-limit.middleware.js";

export const ticketRouter = Router();

ticketRouter.post("/", ticketRateLimiter, asyncHandler(createTicketController));
