# Environment Configuration Guide

## Create `.env` File

Create a `.env` file in the project root with the following content:

\`\`\`env
# =====================================================
# POSTGRESQL DATABASE CONFIGURATION (Prisma)
# =====================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"

# =====================================================
# APPLICATION SETTINGS
# =====================================================
NODE_ENV=development
PORT=3000
API_PREFIX=api
SWAGGER_PATH=api/docs

# =====================================================
# JWT AUTHENTICATION
# =====================================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRATION=1h

# =====================================================
# KAVENEGAR SMS (Production login via OTP)
# =====================================================
KAVENEGAR_API_KEY=your_kavenegar_api_key
# Optional: predefined sender line
KAVENEGAR_SENDER=10004321

# =====================================================
# FRONTEND & CORS
# =====================================================
FRONTEND_URL=http://localhost:4200
CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# =====================================================
# FILE UPLOAD
# =====================================================
MAX_FILE_SIZE=5242880
UPLOAD_LOCATION=./uploads

# =====================================================
# RATE LIMITING
# =====================================================
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
\`\`\`

## PostgreSQL Database Setup

### Option 1: Local PostgreSQL Installation

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL:**
   - Windows: PostgreSQL service should start automatically
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Create Database:**
   \`\`\`bash
   psql -U postgres
   CREATE DATABASE ecommerce_db;
   \q
   \`\`\`

### Option 2: Docker PostgreSQL

\`\`\`bash
docker run --name ecommerce-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=ecommerce_db \
  -p 5432:5432 \
  -d postgres:16-alpine
\`\`\`

### Option 3: Cloud PostgreSQL (Production)

Popular options:
- **Neon** (https://neon.tech) - Free tier with generous limits
- **Supabase** (https://supabase.com) - Free tier
- **Railway** (https://railway.app)
- **AWS RDS**
- **Heroku Postgres**

Update `DATABASE_URL` with your connection string:
\`\`\`env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
\`\`\`

## Verify Connection

Test your database connection:

\`\`\`bash
# Using psql
psql postgresql://postgres:postgres@localhost:5432/ecommerce_db

# Using npm package
npm install -g pg-connection-string
\`\`\`
