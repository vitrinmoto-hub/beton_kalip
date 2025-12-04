# ===== BUILD STAGE =====
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSL ve gerekli araçları yükle
RUN apt-get update && \
    apt-get install -y openssl ca-certificates gzip && \
    rm -rf /var/lib/apt/lists/*

# Package dosyalarını kopyala
COPY package*.json ./
COPY prisma ./prisma/

# Manuel binary'leri aç
RUN gunzip -f /app/prisma/engines/libquery_engine.so.node.gz || true
RUN gunzip -f /app/prisma/engines/schema-engine.gz || true
RUN gunzip -f /app/prisma/engines/query-engine.gz || true
RUN chmod +x /app/prisma/engines/* || true

# Bağımlılıkları yükle
RUN npm install

# Prisma client oluştur - yerel binary'leri kullan
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/prisma/engines/libquery_engine.so.node
ENV PRISMA_QUERY_ENGINE_BINARY=/app/prisma/engines/query-engine
ENV PRISMA_SCHEMA_ENGINE_BINARY=/app/prisma/engines/schema-engine
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
ENV PRISMA_DISABLE_TELEMETRY=1
ENV PRISMA_ENGINE_OFFLINE=1

RUN chmod +x /app/prisma/engines/*
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

# Prisma engine ayarları (runtime için)
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/prisma/engines/libquery_engine.so.node
ENV PRISMA_QUERY_ENGINE_BINARY=/app/prisma/engines/query-engine
ENV PRISMA_SCHEMA_ENGINE_BINARY=/app/prisma/engines/schema-engine
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_DISABLE_TELEMETRY=1

# Gerekli dosyaları kopyala
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Engine'lerin executable olduğundan emin ol
RUN chmod +x /app/prisma/engines/* || true

# Startup script oluştur
RUN echo '#!/bin/sh\n\
    echo "🚀 Starting application..."\n\
    echo "📊 Running database migrations..."\n\
    npx prisma db push --skip-generate || echo "Migration warning - continuing..."\n\
    echo "✅ Database ready!"\n\
    exec npm start' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
