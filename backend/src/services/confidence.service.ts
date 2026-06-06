import type { KbSearchResult } from "../types/kb.types.js";

const retrievalWeight = 0.6;
const chunkSupportWeight = 0.2;
const llmWeight = 0.2;
export const escalationThreshold = 0.7;

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 1);
}

export function calculateRetrievalSimilarity(results: KbSearchResult[]) {
  if (results.length === 0) {
    return 0;
  }

  const total = results.reduce((sum, result) => sum + clampScore(result.similarity), 0);

  return total / results.length;
}

export function calculateChunkSupport(results: KbSearchResult[]) {
  const supportingChunks = results.filter((result) => result.similarity >= 0.7).length;

  return clampScore(supportingChunks / 5);
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
