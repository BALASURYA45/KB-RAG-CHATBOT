import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const utilsDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(utilsDir, "../..");
const projectRoot = path.resolve(backendDir, "..");

config({ path: path.join(projectRoot, ".env") });
config({ path: path.join(backendDir, ".env") });

function getDefaultKnowledgeBasePath() {
  return path.basename(process.cwd()) === "backend"
    ? path.resolve(process.cwd(), "../knowledge-base")
    : path.resolve(process.cwd(), "knowledge-base");
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL && !process.env.POSTGRES_DB) {
    return process.env.DATABASE_URL;
  }

  const database = process.env.POSTGRES_DB ?? "kb_support_assistant";
  const user = process.env.POSTGRES_USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD ?? "postgres";

  return `postgresql://${user}:${password}@localhost:5433/${database}?schema=public`;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  databaseUrl: getDatabaseUrl(),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  ollamaChatModel: process.env.OLLAMA_CHAT_MODEL ?? "llama3.2",
  ollamaEmbeddingModel: process.env.OLLAMA_EMBEDDING_MODEL ?? "nomic-embed-text",
  aiProvider: process.env.AI_PROVIDER ?? "ollama",
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  openaiChatModel: process.env.OPENAI_CHAT_MODEL ?? "gpt-4.1-mini",
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
  openaiEmbeddingDimensions: Number(process.env.OPENAI_EMBEDDING_DIMENSIONS ?? 768),
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API,
  geminiBaseUrl: process.env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta",
  geminiChatModel: process.env.GEMINI_CHAT_MODEL ?? "gemini-2.0-flash",
  geminiEmbeddingModel: process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001",
  geminiEmbeddingDimensions: Number(process.env.GEMINI_EMBEDDING_DIMENSIONS ?? 768),
  adminApiKey: process.env.ADMIN_API_KEY,
  knowledgeBasePath: process.env.KNOWLEDGE_BASE_PATH ?? getDefaultKnowledgeBasePath(),
};
