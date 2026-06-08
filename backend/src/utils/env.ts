import "dotenv/config";
import path from "node:path";

function getDefaultKnowledgeBasePath() {
  return path.basename(process.cwd()) === "backend"
    ? path.resolve(process.cwd(), "../knowledge-base")
    : path.resolve(process.cwd(), "knowledge-base");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5433/kb_support_assistant?schema=public",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL ?? "llama3.2",
  ollamaEmbeddingModel: process.env.OLLAMA_EMBEDDING_MODEL ?? "nomic-embed-text",
  aiProvider: process.env.AI_PROVIDER ?? "ollama",
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  openaiChatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-4.1-mini",
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
  openaiEmbeddingDimensions: Number(process.env.OPENAI_EMBEDDING_DIMENSIONS ?? 768),
  adminApiKey: process.env.ADMIN_API_KEY,
  knowledgeBasePath: process.env.KNOWLEDGE_BASE_PATH ?? getDefaultKnowledgeBasePath(),
};
