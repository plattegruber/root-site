# Dental Website Doctor MCP server with headless Chromium.
# Build context is the repository root (pnpm workspace + lockfile live there):
#   fly deploy . --config apps/dental-website-doctor/fly.toml
FROM node:24-bookworm-slim

ENV CI=true \
	PNPM_HOME=/pnpm \
	PATH=/pnpm:$PATH \
	PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/dental-website-doctor/package.json apps/dental-website-doctor/
RUN pnpm install --frozen-lockfile --filter dental-website-doctor

# Chromium and its system libraries, at the version the installed Playwright expects.
RUN pnpm --dir apps/dental-website-doctor exec playwright install --with-deps chromium

COPY apps/dental-website-doctor apps/dental-website-doctor
RUN pnpm --dir apps/dental-website-doctor build

WORKDIR /app/apps/dental-website-doctor
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
