import type { KbSearchResult } from "../types/kb.types.js";

const retrievalWeight = 0.6;
const chunkSupportWeight = 0.2;
const llmWeight = 0.2;
export const escalationThreshold = 0.65;
export const citationSimilarityThreshold = 0.65;
export const directAnswerSimilarityThreshold = 0.7;

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 1);
}

export function calculateRetrievalSimilarity(results: KbSearchResult[]) {
  if (results.length === 0) {
    return 0;
  }

  const topResults = results.slice(0, 3);
  const total = topResults.reduce((sum, result) => sum + clampScore(result.similarity), 0);

  return total / topResults.length;
}

export function calculateChunkSupport(results: KbSearchResult[]) {
  const supportingChunks = results.filter(
    (result) => result.similarity >= citationSimilarityThreshold,
  ).length;

  return clampScore(supportingChunks / 3);
}

export function calculateConfidence(input: {
  retrievalResults: KbSearchResult[];
  llmConfidence: number;
}) {
  const similarity = calculateRetrievalSimilarity(input.retrievalResults);
  const chunkSupport = calculateChunkSupport(input.retrievalResults);
  const llmConfidence = clampScore(input.llmConfidence);

  return clampScore(
    similarity * retrievalWeight + chunkSupport * chunkSupportWeight + llmConfidence * llmWeight,
  );
}
