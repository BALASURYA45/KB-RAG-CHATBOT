import { Router } from "express";
import { createTicketController } from "../controllers/ticket.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";

export const ticketRouter = Router();

ticketRouter.post("/", asyncHandler(createTicketController));
