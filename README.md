# KB RAG Chatbot

Production-ready Level-0 self-service knowledge base chatbot.

## Docker

Install Ollama and pull the local models:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

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

See `DEPLOYMENT.md` for the full checklist, including Ollama setup and knowledge-base reindexing.
