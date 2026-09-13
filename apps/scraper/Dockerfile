FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/scraper/package.json ./apps/scraper/
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
WORKDIR /app/apps/scraper
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

# Install chromium for puppeteer
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont nodejs yarn
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc ./
COPY --from=builder /app/apps/scraper/package.json ./apps/scraper/
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/apps/scraper/dist ./apps/scraper/dist

WORKDIR /app/apps/scraper
EXPOSE 3002
CMD ["node", "dist/main.js"]
