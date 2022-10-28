FROM node:lts-alpine
# ENV NODE_ENV=production
# ENV CI=true
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", ".npmrc", "./"]
RUN mkdir backend frontend packages
COPY ["packages", "./packages/"]
COPY ["backend/package.json", "backend/pnpm-lock.yaml", "./backend/"]
COPY ["frontend/package.json", "frontend/pnpm-lock.yaml", "./frontend/"]
RUN corepack enable && pnpm i --frozen-lockfile && rm -rf ~/.local/share/pnpm/store
COPY . .
RUN pnpm build:frontend
EXPOSE 3000
CMD ["pnpm", "dev:backend", "--", "-h", "0.0.0.0"]
