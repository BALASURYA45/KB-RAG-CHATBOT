import type { Request, Response } from "express";
import { reindexKnowledgeBase } from "../services/kb-ingestion.service.js";

export async function reindexKnowledgeBaseController(_request: Request, response: Response) {
  const stats = await reindexKnowledgeBase();

  response.status(200).json(stats);
}
