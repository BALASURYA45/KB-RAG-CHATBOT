DROP INDEX IF EXISTS "kb_documents_embedding_idx";

TRUNCATE TABLE "kb_documents";

ALTER TABLE "kb_documents"
  ALTER COLUMN "embedding" TYPE vector(768);

CREATE INDEX "kb_documents_embedding_idx"
  ON "kb_documents"
  USING ivfflat ("embedding" vector_cosine_ops)
  WITH (lists = 100);
