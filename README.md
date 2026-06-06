# KB RAG Chatbot

Production-ready Level-0 self-service knowledge base chatbot.

## Docker

Set `OPENAI_API_KEY` in your shell or a local `.env` file, then run:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

Useful checks:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/health/db
```
