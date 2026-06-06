import { OpenAIEmbeddings } from "@langchain/openai";
import { env } from "../utils/env.js";

const embeddingModel = "text-embedding-3-small";

function createEmbeddingClient() {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required to generate knowledge base embeddings.");
  }

  return new OpenAIEmbeddings({
    apiKey: env.openAiApiKey,
    model: embeddingModel,
  });
}

export async function embedDocuments(documents: string[]) {
  if (documents.length === 0) {
    return [];
  }

  const embeddings = createEmbeddingClient();

  return embeddings.embedDocuments(documents);
}

export async function embedQuery(query: string) {
  const embeddings = createEmbeddingClient();

  return embeddings.embedQuery(query);
}
