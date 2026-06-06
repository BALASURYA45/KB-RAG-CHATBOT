import { prisma } from "../db/prisma.js";

export async function checkDatabaseHealth() {
  const startedAt = Date.now();

  await prisma.$queryRaw`SELECT 1`;

  return {
    status: "ok",
    latencyMs: Date.now() - startedAt,
  };
}
