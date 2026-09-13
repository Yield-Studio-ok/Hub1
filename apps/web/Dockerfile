FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
WORKDIR /app/apps/web
# NEXT_PUBLIC_API_URL should be provided at build time if static, or handled dynamically
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]
