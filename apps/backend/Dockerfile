# backend Dockerfile - build TypeScript and run
FROM node:20-bullseye AS builder
WORKDIR /app

# install deps (use legacy-peer-deps to avoid peer dependency resolution errors during build)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# copy project, generate prisma client and build
COPY prisma ./prisma
COPY tsconfig.json ./
COPY . .
RUN npx prisma generate
RUN npm run build

# runtime
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/server.js"]
