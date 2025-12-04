# ===== BUILD STAGE =====
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSL ve network araçlarını yükle
RUN apt-get update && \
    apt-get install -y openssl ca-certificates curl wget && \
    rm -rf /var/lib/apt/lists/*

# Prisma için ortam değişkenleri
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_GENERATE_SKIP_AUTOINSTALL=true

# Prisma binary'lerini manuel indir (retry ve timeout ile)
ENV PRISMA_VERSION=5.10.2
ENV PRISMA_ENGINE_HASH=605197351a3c8bdd595af2d2a9bc3025bca48ea2
RUN mkdir -p /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH} && \
    cd /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH} && \
    for engine in query-engine schema-engine; do \
    for i in 1 2 3 4 5; do \
    echo "Downloading ${engine} (attempt $i)..." && \
    curl -L --retry 5 --retry-delay 5 --connect-timeout 60 --max-time 600 \
    -o ${engine}.gz \
    "https://binaries.prisma.sh/all_commits/${PRISMA_ENGINE_HASH}/debian-openssl-3.0.x/${engine}.gz" && \
    gunzip -f ${engine}.gz && \
    chmod +x ${engine} && \
    break || sleep 10; \
    done; \
    done && \
    ls -la

# Package dosyalarını kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Bağımlılıkları yükle (Prisma binary zaten indirildi)
RUN npm install

# Prisma generate
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
