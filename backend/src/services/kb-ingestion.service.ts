import { promises as fs } from "node:fs";
import path from "node:path";
import {
  clearKbDocuments,
  insertKbDocuments,
} from "../repositories/kb-document.repository.js";
import type { KbChunk, ReindexStats } from "../types/kb.types.js";
import { chunkSections, parseMarkdownSections } from "../utils/markdown.util.js";
import { env } from "../utils/env.js";
import { embedDocuments } from "./embedding.service.js";

async function findMarkdownFiles(directory: string) {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

export async function loadKnowledgeBaseChunks(): Promise<{
  filesProcessed: number;
  chunks: KbChunk[];
}> {
  const files = await findMarkdownFiles(env.knowledgeBasePath);
  const chunks: KbChunk[] = [];

  for (const filePath of files) {
    const filename = path.basename(filePath);
    const markdown = await fs.readFile(filePath, "utf8");
    const sections = parseMarkdownSections(filename, markdown);

    chunks.push(...chunkSections(sections));
  }

  return {
    filesProcessed: files.length,
    chunks,
  };
}

export async function reindexKnowledgeBase(): Promise<ReindexStats> {
  const { filesProcessed, chunks } = await loadKnowledgeBaseChunks();
  const embeddings = await embedDocuments(chunks.map((chunk) => chunk.content));
  const chunksWithEmbeddings = chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index],
  }));

  await clearKbDocuments();
  const documentsInserted = await insertKbDocuments(chunksWithEmbeddings);

  return {
    filesProcessed,
    chunksCreated: chunks.length,
    documentsInserted,
  };
}
