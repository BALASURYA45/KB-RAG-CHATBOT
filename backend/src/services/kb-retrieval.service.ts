import { searchKbDocumentsByEmbedding } from "../repositories/kb-document.repository.js";
import type { KbSearchResult } from "../types/kb.types.js";
import { embedQuery } from "./embedding.service.js";

const defaultResultLimit = 5;
const maximumResultLimit = 10;

export type SearchKnowledgeBaseInput = {
  question: string;
  limit?: number;
};

function normalizeLimit(limit?: number) {
  if (!limit || Number.isNaN(limit)) {
    return defaultResultLimit;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), maximumResultLimit);
}

export async function searchKnowledgeBase(
  input: SearchKnowledgeBaseInput,
): Promise<KbSearchResult[]> {
  const question = input.question.trim();

  if (question.length === 0) {
    throw new Error("Question is required for knowledge base search.");
  }

  const embedding = await embedQuery(question);

  return searchKbDocumentsByEmbedding(embedding, normalizeLimit(input.limit));
}
