import { Router } from "express";
import { getDatabaseHealth, getHealth } from "../controllers/health.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";

export const healthRouter = Router();

healthRouter.get("/", getHealth);
healthRouter.get("/db", asyncHandler(getDatabaseHealth));
