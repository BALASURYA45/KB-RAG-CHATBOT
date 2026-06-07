import { env } from "../utils/env.js";

type OllamaEmbedResponse = {
  embeddings?: number[][];
  embedding?: number[];
};

async function requestOllamaEmbedding(input: string | string[]) {
  const response = await fetch(`${env.ollamaBaseUrl}/api/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.ollamaEmbeddingModel,
      input,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Ollama embedding request failed: ${message}`);
  }

  return (await response.json()) as OllamaEmbedResponse;
}

export async function embedDocuments(documents: string[]) {
  if (documents.length === 0) {
    return [];
  }

  const payload = await requestOllamaEmbedding(documents);

  if (!payload.embeddings) {
    throw new Error("Ollama embedding response did not include embeddings.");
  }

  return payload.embeddings;
}

export async function embedQuery(query: string) {
  const payload = await requestOllamaEmbedding(query);

  if (payload.embedding) {
    return payload.embedding;
  }

  if (payload.embeddings?.[0]) {
    return payload.embeddings[0];
  }

  throw new Error("Ollama embedding response did not include an embedding.");
}
