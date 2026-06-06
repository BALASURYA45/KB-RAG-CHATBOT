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
    "postgresql://postgres:postgres@localhost:5432/kb_support_assistant?schema=public",
  openAiApiKey: process.env.OPENAI_API_KEY,
  adminApiKey: process.env.ADMIN_API_KEY,
  knowledgeBasePath: process.env.KNOWLEDGE_BASE_PATH ?? getDefaultKnowledgeBasePath(),
};
