# Multi-stage build for production
ARG NODE_IMAGE=node:20-alpine
FROM ${NODE_IMAGE} AS base

# Dependencies stage
FROM base AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Builder stage
FROM base AS builder

WORKDIR /app

ARG NEXT_PUBLIC_ENABLE_OTP=false
ARG NEXT_PUBLIC_ENABLE_PASSWORD_RESET=false
ARG NEXT_PUBLIC_ORDER_TAX_RATE=0.09
ARG NEXT_PUBLIC_ORDER_SHIPPING_FLAT=50000
ARG NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD=500000
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost
ARG NEXT_PUBLIC_API_URL=http://localhost/api
ARG BACKEND_API_URL=http://backend:3000/api
ARG NEXT_PUBLIC_STORE_PHONE=
ARG NEXT_PUBLIC_STORE_EMAIL=
ARG NEXT_PUBLIC_STORE_ADDRESS=
ARG NEXT_PUBLIC_BANK_CARD_NUMBER=
ARG NEXT_PUBLIC_BANK_SHEBA=
ARG NEXT_PUBLIC_BANK_HOLDER=

ENV NEXT_PUBLIC_ENABLE_OTP=$NEXT_PUBLIC_ENABLE_OTP
ENV NEXT_PUBLIC_ENABLE_PASSWORD_RESET=$NEXT_PUBLIC_ENABLE_PASSWORD_RESET
ENV NEXT_PUBLIC_ORDER_TAX_RATE=$NEXT_PUBLIC_ORDER_TAX_RATE
ENV NEXT_PUBLIC_ORDER_SHIPPING_FLAT=$NEXT_PUBLIC_ORDER_SHIPPING_FLAT
ENV NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD=$NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV NEXT_PUBLIC_STORE_PHONE=$NEXT_PUBLIC_STORE_PHONE
ENV NEXT_PUBLIC_STORE_EMAIL=$NEXT_PUBLIC_STORE_EMAIL
ENV NEXT_PUBLIC_STORE_ADDRESS=$NEXT_PUBLIC_STORE_ADDRESS
ENV NEXT_PUBLIC_BANK_CARD_NUMBER=$NEXT_PUBLIC_BANK_CARD_NUMBER
ENV NEXT_PUBLIC_BANK_SHEBA=$NEXT_PUBLIC_BANK_SHEBA
ENV NEXT_PUBLIC_BANK_HOLDER=$NEXT_PUBLIC_BANK_HOLDER

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["node", "server.js"]
