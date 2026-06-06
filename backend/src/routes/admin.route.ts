import { Router } from "express";
import { reindexKnowledgeBaseController } from "../controllers/admin.controller.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";

export const adminRouter = Router();

adminRouter.post("/reindex", asyncHandler(reindexKnowledgeBaseController));
