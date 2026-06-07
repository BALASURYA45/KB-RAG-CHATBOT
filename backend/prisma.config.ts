import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const configDir = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.join(configDir, ".env") });

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5433/kb_support_assistant?schema=public";

export default defineConfig({
  schema: path.join(configDir, "prisma/schema.prisma"),
  migrations: {
    path: path.join(configDir, "prisma/migrations"),
  },
  datasource: {
    url: databaseUrl,
  },
});
