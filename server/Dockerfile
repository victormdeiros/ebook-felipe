# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations

RUN npm run build && npm prune --production

# ── Runtime stage ────────────────────────────────────────────
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
