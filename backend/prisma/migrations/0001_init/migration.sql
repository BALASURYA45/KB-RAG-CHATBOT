CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "kb_documents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "filename" VARCHAR(255) NOT NULL,
  "section" VARCHAR(255) NOT NULL,
  "content" TEXT NOT NULL,
  "embedding" vector(1536) NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "kb_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "support_tickets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_email" VARCHAR(255) NOT NULL,
  "question" TEXT NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'OPEN',
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chat_sessions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "session_id" VARCHAR(255) NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "confidence" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "kb_documents_filename_idx" ON "kb_documents" ("filename");
CREATE INDEX "kb_documents_embedding_idx" ON "kb_documents" USING ivfflat ("embedding" vector_cosine_ops) WITH (lists = 100);
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" ("status");
CREATE INDEX "chat_sessions_session_id_idx" ON "chat_sessions" ("session_id");
