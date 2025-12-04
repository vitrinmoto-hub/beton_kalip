# ===== BUILD STAGE =====
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSL ve network araçlarını yükle
RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl wget && \
    rm -rf /var/lib/apt/lists/*

# Prisma için network ayarları - GitHub mirror kullan
ENV PRISMA_ENGINES_MIRROR="https://binaries.prisma.sh"
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_BINARIES_MIRROR="https://github.com/nicksrandall/prisma-binary-mirror/releases/download"
ENV DEBUG=prisma:*

# Package dosyalarını kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Bağımlılıkları yükle (retry logic ile)
RUN npm install || npm install || npm install

# Prisma client'ı oluştur (retry logic ile)
RUN npx prisma generate || npx prisma generate || npx prisma generate

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
