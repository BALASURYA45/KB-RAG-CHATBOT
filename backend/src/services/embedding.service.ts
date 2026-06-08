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

type GeminiEmbeddingResponse = {
  embedding?: {
    values?: number[];
  };
};

type GeminiBatchEmbeddingResponse = {
  embeddings?: Array<{
    values?: number[];
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

function getGeminiApiKey() {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini.");
  }

  return env.geminiApiKey;
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

async function requestGeminiEmbedding(input: string, taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {
  const response = await fetch(
    `${env.geminiBaseUrl}/models/${env.geminiEmbeddingModel}:embedContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(),
      },
      body: JSON.stringify({
        model: `models/${env.geminiEmbeddingModel}`,
        content: {
          parts: [
            {
              text: input,
            },
          ],
        },
        embedContentConfig: {
          taskType,
          outputDimensionality: env.geminiEmbeddingDimensions,
        },
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini embedding request failed: ${message}`);
  }

  return (await response.json()) as GeminiEmbeddingResponse;
}

async function requestGeminiDocumentEmbeddings(documents: string[]) {
  const response = await fetch(
    `${env.geminiBaseUrl}/models/${env.geminiEmbeddingModel}:batchEmbedContents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getGeminiApiKey(),
      },
      body: JSON.stringify({
        requests: documents.map((document) => ({
          model: `models/${env.geminiEmbeddingModel}`,
          content: {
            parts: [
              {
                text: document,
              },
            ],
          },
          embedContentConfig: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: env.geminiEmbeddingDimensions,
          },
        })),
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini batch embedding request failed: ${message}`);
  }

  return (await response.json()) as GeminiBatchEmbeddingResponse;
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

  if (env.aiProvider === "gemini") {
    const payload = await requestGeminiDocumentEmbeddings(documents);
    const embeddings = payload.embeddings?.map((embedding) => embedding.values);

    if (!embeddings || embeddings.some((embedding) => !embedding)) {
      throw new Error("Gemini embedding response did not include embeddings.");
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

  if (env.aiProvider === "gemini") {
    const payload = await requestGeminiEmbedding(query, "RETRIEVAL_QUERY");
    const embedding = payload.embedding?.values;

    if (!embedding) {
      throw new Error("Gemini embedding response did not include an embedding.");
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
