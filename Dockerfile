FROM node:22-bookworm-slim AS app

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY docs ./docs
COPY packages ./packages
COPY scripts ./scripts
COPY .env.example README.md ./

RUN pnpm install --frozen-lockfile
RUN pnpm build

EXPOSE 8787

CMD ["pnpm", "--filter", "@playkeep/gatekeeper", "start"]
