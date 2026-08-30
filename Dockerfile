# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:26-alpine

RUN apk add --no-cache nginx tini

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY package*.json ./
COPY server ./server
COPY tsconfig.server.json ./tsconfig.server.json
COPY docker/nginx.conf /etc/nginx/nginx.conf

RUN npm ci --omit=dev && npm install -g tsx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/bin/sh", "-c", "tsx /app/server/index.ts & nginx -g 'daemon off;'"]
