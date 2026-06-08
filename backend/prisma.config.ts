import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

config({ path: path.join(projectRoot, ".env") });
config({ path: path.join(configDir, ".env") });

function getLocalDatabaseUrl() {
  const database = process.env.POSTGRES_DB ?? "kb_support_assistant";
  const user = process.env.POSTGRES_USER ?? "postgres";
  const password = process.env.POSTGRES_PASSWORD ?? "postgres";

  return `postgresql://${user}:${password}@localhost:5433/${database}?schema=public`;
}

const databaseUrl =
  process.env.DATABASE_URL && !process.env.POSTGRES_DB
    ? process.env.DATABASE_URL
    : getLocalDatabaseUrl();

export default defineConfig({
  schema: path.join(configDir, "prisma/schema.prisma"),
  migrations: {
    path: path.join(configDir, "prisma/migrations"),
  },
  datasource: {
    url: databaseUrl,
  },
});
