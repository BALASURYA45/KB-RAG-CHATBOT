import type { KbChunk, KbSection } from "../types/kb.types.js";

const headingPattern = /^(#{1,6})\s+(.+)$/;

export function sanitizeMarkdown(markdown: string) {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function parseMarkdownSections(filename: string, markdown: string): KbSection[] {
  const sanitized = sanitizeMarkdown(markdown);
  const lines = sanitized.split("\n");
  const sections: KbSection[] = [];
  let currentSection = "Overview";
  let buffer: string[] = [];

  const flush = () => {
    const content = buffer.join("\n").trim();

    if (content.length > 0) {
      sections.push({
        filename,
        section: currentSection,
        content,
      });
    }

    buffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(headingPattern);

    if (headingMatch) {
      flush();
      currentSection = headingMatch[2].trim();
      continue;
    }

    buffer.push(line);
  }

  flush();

  return sections;
}

export function chunkSections(
  sections: KbSection[],
  options: { minChunkSize?: number; maxChunkSize?: number } = {},
): KbChunk[] {
  const minChunkSize = options.minChunkSize ?? 500;
  const maxChunkSize = options.maxChunkSize ?? 1000;
  const chunks: KbChunk[] = [];

  for (const section of sections) {
    const paragraphs = section.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    let current = "";
    let chunkIndex = 0;

    const pushChunk = () => {
      if (current.trim().length === 0) {
        return;
      }

      chunks.push({
        ...section,
        content: current.trim(),
        chunkIndex,
      });
      chunkIndex += 1;
      current = "";
    };

    for (const paragraph of paragraphs) {
      const next = current.length === 0 ? paragraph : `${current}\n\n${paragraph}`;

      if (next.length > maxChunkSize && current.length >= minChunkSize) {
        pushChunk();
        current = paragraph;
      } else if (paragraph.length > maxChunkSize) {
        pushChunk();

        for (let index = 0; index < paragraph.length; index += maxChunkSize) {
          current = paragraph.slice(index, index + maxChunkSize);
          pushChunk();
        }
      } else {
        current = next;
      }
    }

    pushChunk();
  }

  return chunks;
}
