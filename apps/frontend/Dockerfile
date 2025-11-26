# frontend Dockerfile - build with Vite and serve static files with nginx
FROM node:20-bullseye AS builder
WORKDIR /app

# install deps (use legacy-peer-deps to avoid peer dependency resolution errors during build)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# copy source and build
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
