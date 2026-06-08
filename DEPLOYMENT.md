# Deployment Guide

This app is ready to deploy with Docker Compose.

## 1. Server Requirements

- Docker and Docker Compose
- A Gemini API key for hosted chat and embeddings

## 2. Configure Environment

Copy the deployment template:

```bash
cp .env.deploy.example .env
```

Update these values:

- `POSTGRES_PASSWORD`
- `ADMIN_API_KEY`
- `FRONTEND_ORIGIN`
- `GEMINI_API_KEY`
- `VITE_API_BASE_URL`

If your server already uses `GEMINI_API`, that name is also supported.

For a VPS using an IP address, examples:

```bash
FRONTEND_ORIGIN=http://YOUR_SERVER_IP:5173
VITE_API_BASE_URL=http://YOUR_SERVER_IP:4000
```

## 3. Start The App

```bash
docker compose --env-file .env up --build -d
```

## 4. Apply/Rebuild Knowledge Base

The backend applies Prisma migrations on startup. After the app is running, reindex the Markdown knowledge base:

```bash
curl -X POST http://YOUR_SERVER_IP:4000/api/admin/reindex \
  -H "x-admin-api-key: YOUR_ADMIN_API_KEY"
```

## 5. Verify Deployment

```bash
curl http://YOUR_SERVER_IP:4000/api/health
curl http://YOUR_SERVER_IP:4000/api/health/db
```

Open:

```text
http://YOUR_SERVER_IP:5173
```

## Notes

- Keep `ADMIN_API_KEY` secret.
- Keep `GEMINI_API_KEY` secret.
- Use a reverse proxy with HTTPS for a public deployment.
- The backend uses `AI_PROVIDER=gemini` for deployment.
- Gemini embeddings are requested with `GEMINI_EMBEDDING_DIMENSIONS=768` to match the pgvector schema.
