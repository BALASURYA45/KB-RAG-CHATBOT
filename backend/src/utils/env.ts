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
  adminApiKey: process.env.ADMIN_API_KEY,
  knowledgeBasePath: process.env.KNOWLEDGE_BASE_PATH ?? getDefaultKnowledgeBasePath(),
};
