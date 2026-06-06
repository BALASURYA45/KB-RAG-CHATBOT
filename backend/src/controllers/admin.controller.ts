import type { Request, Response } from "express";
import { securityConfig } from "../config/security.config.js";
import { reindexKnowledgeBase } from "../services/kb-ingestion.service.js";
import { searchKnowledgeBase } from "../services/kb-retrieval.service.js";
import {
  readOptionalNumberBodyField,
  readRequiredStringBodyField,
} from "../utils/request-validation.util.js";

export async function reindexKnowledgeBaseController(_request: Request, response: Response) {
  const stats = await reindexKnowledgeBase();

  response.status(200).json(stats);
}

export async function searchKnowledgeBaseController(request: Request, response: Response) {
  const question = readRequiredStringBodyField(request, "question", {
    maxLength: securityConfig.maxQuestionLength,
  });
  const limit = readOptionalNumberBodyField(request, "limit");
  const results = await searchKnowledgeBase({ question, limit });

  response.status(200).json({ results });
}
