export type KbSection = {
  filename: string;
  section: string;
  content: string;
};

export type KbChunk = KbSection & {
  chunkIndex: number;
};

export type KbChunkWithEmbedding = KbChunk & {
  embedding: number[];
};

export type KbSearchResult = {
  id: string;
  filename: string;
  section: string;
  content: string;
  similarity: number;
};

export type ReindexStats = {
  filesProcessed: number;
  chunksCreated: number;
  documentsInserted: number;
};
