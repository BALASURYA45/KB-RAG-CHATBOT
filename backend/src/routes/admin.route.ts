import { Router } from "express";
import {
  reindexKnowledgeBaseController,
  searchKnowledgeBaseController,
} from "../controllers/admin.controller.js";
import { requireAdminKey } from "../middleware/admin-auth.middleware.js";
import { asyncHandler } from "../middleware/async-handler.middleware.js";
import { adminRateLimiter } from "../middleware/rate-limit.middleware.js";

export const adminRouter = Router();

adminRouter.use(adminRateLimiter);
adminRouter.use(requireAdminKey);

adminRouter.post("/reindex", asyncHandler(reindexKnowledgeBaseController));
adminRouter.post("/search", asyncHandler(searchKnowledgeBaseController));
