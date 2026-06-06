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
