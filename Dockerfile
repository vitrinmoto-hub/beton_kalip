# ===== BUILD STAGE =====
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSL ve gerekli araçları yükle
RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl gzip && \
    rm -rf /var/lib/apt/lists/*

# Prisma için ayarlar - YEREL BINARY KULLAN (indirme yok!)
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Package dosyalarını kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Manuel olarak eklenen binary'yi aç (gzip -> .so.node)
RUN gunzip -f /app/prisma/engines/libquery_engine.so.node.gz || true

# Prisma'ya yerel binary konumunu söyle
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/prisma/engines/libquery_engine.so.node

# Bağımlılıkları yükle
RUN npm install

# Prisma client oluştur (artık indirme yapmayacak, yerel dosyayı kullanacak)
RUN npx prisma generate

# Uygulama kodunu kopyala
COPY . .

# Build için gerekli environment variables
ENV DATABASE_URL="file:./dev.db"

# Next.js build
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM node:20-slim AS runner

WORKDIR /app

# OpenSSL yükle (runtime için gerekli)
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Gerekli dosyaları kopyala
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
