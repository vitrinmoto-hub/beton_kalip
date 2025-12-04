# ===== BUILD STAGE =====
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSL ve network araçlarını yükle
RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl wget && \
    rm -rf /var/lib/apt/lists/*

# Prisma için network ayarları
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Package dosyalarını kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Bağımlılıkları yükle
RUN npm install

# Prisma binary'lerini manuel indir (timeout 10 dakika)
RUN for i in 1 2 3 4 5; do \
    echo "Prisma generate deneme $i..." && \
    timeout 600 npx prisma generate && break || \
    echo "Deneme $i başarısız, 30 saniye bekliyor..." && \
    sleep 30; \
    done

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
