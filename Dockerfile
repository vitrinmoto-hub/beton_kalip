# Multi-stage build for optimal image size
FROM node:22-alpine AS deps

# Install Prisma dependencies
RUN apk add --no-cache openssl libc6-compat curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Manually download Prisma engines with retry mechanism
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

# Set Prisma environment variables
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
ENV PRISMA_GENERATE_SKIP_AUTOINSTALL=true

# Generate Prisma client
RUN npx prisma generate

# Copy Prisma engines to the correct location
RUN mkdir -p /app/node_modules/.prisma/client && \
    cp /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH}/query-engine /app/node_modules/.prisma/client/query-engine && \
    cp /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH}/schema-engine /app/node_modules/.prisma/client/schema-engine && \
    chmod +x /app/node_modules/.prisma/client/query-engine /app/node_modules/.prisma/client/schema-engine

# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy prisma schema and engines
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH}/query-engine ./node_modules/.prisma/client/query-engine
COPY --from=deps /root/.cache/prisma/engines/${PRISMA_ENGINE_HASH}/schema-engine ./node_modules/.prisma/client/schema-engine

# Copy application code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client/query-engine ./node_modules/.prisma/client/query-engine
COPY --from=builder /app/node_modules/.prisma/client/schema-engine ./node_modules/.prisma/client/schema-engine

# Ensure proper permissions for Prisma engines
RUN chmod +x ./node_modules/.prisma/client/query-engine ./node_modules/.prisma/client/schema-engine

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
