# ============================================
# Dependencies Stage
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# ============================================
# Builder Stage
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application (creates .next/standalone)
RUN npm run build

# List built files for debugging
RUN echo "=== Build Output ===" && \
    ls -la .next/ && \
    echo "=== Standalone Output ===" && \
    ls -la .next/standalone/ || echo "No standalone folder"

# ============================================
# Runner Stage (Production)
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Install required packages
RUN apk add --no-cache \
    dumb-init \
    tini

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (with error handling)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Next.js build output
# Standalone mode puts everything we need in .next/standalone/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Verify server.js exists
RUN ls -la && \
    if [ ! -f "server.js" ]; then \
        echo "ERROR: server.js not found!" && \
        echo "Contents of /app:" && \
        ls -la && \
        exit 1; \
    fi

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

# Use tini for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start Next.js server
CMD ["node", "server.js"]