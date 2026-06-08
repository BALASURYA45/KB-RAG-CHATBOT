import { env } from "../utils/env.js";

type OllamaEmbedResponse = {
  embeddings?: number[][];
  embedding?: number[];
};

type OpenAiEmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
  }>;
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

function getOpenAiApiKey() {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai.");
  }

  return env.openaiApiKey;
}

async function requestOpenAiEmbeddings(input: string | string[]) {
  const response = await fetch(`${env.openaiBaseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openaiEmbeddingModel,
      input,
      dimensions: env.openaiEmbeddingDimensions,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI embedding request failed: ${message}`);
  }

  return (await response.json()) as OpenAiEmbeddingResponse;
}

export async function embedDocuments(documents: string[]) {
  if (documents.length === 0) {
    return [];
  }

  if (env.aiProvider === "openai") {
    const payload = await requestOpenAiEmbeddings(documents);
    const embeddings = payload.data?.map((item) => item.embedding);

    if (!embeddings || embeddings.some((embedding) => !embedding)) {
      throw new Error("OpenAI embedding response did not include embeddings.");
    }

    return embeddings as number[][];
  }

  const payload = await requestOllamaEmbedding(documents);

  if (!payload.embeddings) {
    throw new Error("Ollama embedding response did not include embeddings.");
  }

  return payload.embeddings;
}

export async function embedQuery(query: string) {
  if (env.aiProvider === "openai") {
    const payload = await requestOpenAiEmbeddings(query);
    const embedding = payload.data?.[0]?.embedding;

    if (!embedding) {
      throw new Error("OpenAI embedding response did not include an embedding.");
    }

    return embedding;
  }

  const payload = await requestOllamaEmbedding(query);

  if (payload.embedding) {
    return payload.embedding;
  }

  if (payload.embeddings?.[0]) {
    return payload.embeddings[0];
  }

  throw new Error("Ollama embedding response did not include an embedding.");
}
