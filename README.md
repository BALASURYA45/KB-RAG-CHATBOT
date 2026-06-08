# KB RAG Chatbot

Production-ready Level-0 self-service knowledge base chatbot.

## Docker

Create a local `.env` file and set your Gemini key:

```bash
cp .env.deploy.example .env
```

Update:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_CHAT_MODEL=gemini-2.0-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_EMBEDDING_DIMENSIONS=768
```

The backend also accepts `GEMINI_API` if that is the variable name you already use.

Then run:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- PostgreSQL: `localhost:5433`

Useful checks:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/health/db
```

## Deployment

For a server deployment, copy the deployment environment template and update the public URLs/secrets:

```bash
cp .env.deploy.example .env
```

Then run:

```bash
docker compose --env-file .env up --build -d
```

See `DEPLOYMENT.md` for the full checklist, including knowledge-base reindexing.
