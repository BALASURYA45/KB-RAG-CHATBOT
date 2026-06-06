import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import type { KbChunkWithEmbedding, KbSearchResult } from "../types/kb.types.js";

function toPgVector(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}

export async function clearKbDocuments() {
  await prisma.kbDocument.deleteMany();
}

export async function insertKbDocuments(chunks: KbChunkWithEmbedding[]) {
  if (chunks.length === 0) {
    return 0;
  }

  const values = chunks.map((chunk) => {
    return Prisma.sql`(${chunk.filename}, ${chunk.section}, ${chunk.content}, ${toPgVector(
      chunk.embedding,
    )}::vector)`;
  });

  await prisma.$executeRaw`
    INSERT INTO kb_documents (filename, section, content, embedding)
    VALUES ${Prisma.join(values)}
  `;

  return chunks.length;
}

export async function countKbDocuments() {
  return prisma.kbDocument.count();
}

export async function searchKbDocumentsByEmbedding(
  embedding: number[],
  limit: number,
): Promise<KbSearchResult[]> {
  const queryVector = toPgVector(embedding);

  return prisma.$queryRaw<KbSearchResult[]>`
    SELECT
      id::text,
      filename,
      section,
      content,
      1 - (embedding <=> ${queryVector}::vector) AS similarity
    FROM kb_documents
    ORDER BY embedding <=> ${queryVector}::vector
    LIMIT ${limit}
  `;
}
