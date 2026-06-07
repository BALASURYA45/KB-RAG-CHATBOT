# Database

The application uses PostgreSQL with the `pgvector` extension.

The first migration lives at:

`backend/prisma/migrations/0001_init/migration.sql`

It creates:

- `kb_documents`
- `support_tickets`
- `chat_sessions`

Run migrations from the backend workspace after PostgreSQL is available:

```bash
npm run prisma:migrate --workspace backend
```

For Docker Compose, PostgreSQL is available at:

```text
postgresql://postgres:postgres@localhost:5433/kb_support_assistant?schema=public
```

Start only the database:

```bash
docker compose up -d postgres
```

Then run:

```bash
npm run prisma:deploy --workspace backend
```
