FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci

FROM deps AS build

COPY backend backend
COPY knowledge-base knowledge-base

WORKDIR /app/backend

RUN npm run prisma:generate
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/backend/dist backend/dist
COPY --from=build /app/backend/prisma backend/prisma
COPY --from=build /app/backend/prisma.config.ts backend/prisma.config.ts
COPY knowledge-base knowledge-base

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:deploy --workspace backend && npm run start --workspace backend"]
