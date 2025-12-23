# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Provide DATABASE_URL during build for Prisma 7 config loading
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Compile seed file to JavaScript
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --skipLibCheck --module commonjs --target ES2022

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Install Prisma CLI globally for runtime migrations
RUN npm install -g prisma@7.2.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy built application (includes compiled seed file in dist/prisma)
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

# Ensure runtime user owns app files (including node_modules for any runtime writes)
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]