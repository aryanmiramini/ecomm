# 🐳 Docker Setup Guide

This guide will help you run the E-commerce NestJS application using Docker.

## 📋 Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose installed (included with Docker Desktop)

## 🚀 Quick Start

### 1. Build and Start Services

\`\`\`bash
# Build and start all services (app + database)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
\`\`\`

### 2. Access the Application

Once the containers are running:

- **API**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **PgAdmin** (Database UI): http://localhost:5050
  - Email: `admin@admin.com`
  - Password: `admin`

## 📦 What's Included

The Docker setup includes:

1. **NestJS Application** - Your e-commerce backend API
2. **PostgreSQL Database** - Database with persistent storage
3. **PgAdmin** - Web-based database management tool (optional)

## 🔧 Common Commands

### Start Services
\`\`\`bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start only specific services
docker-compose up postgres
\`\`\`

### Stop Services
\`\`\`bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This deletes your database data!)
docker-compose down -v
\`\`\`

### View Logs
\`\`\`bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs app
docker-compose logs postgres
\`\`\`

### Rebuild Application
\`\`\`bash
# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build app
\`\`\`

### Execute Commands in Container
\`\`\`bash
# Access app container shell
docker-compose exec app sh

# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d ecommerce_db
\`\`\`

## 🗃️ Database Management

### Run Migrations
\`\`\`bash
# Migrations run automatically on startup, but you can run manually:
docker-compose exec app npx prisma migrate deploy
\`\`\`

### Seed Database
\`\`\`bash
docker-compose exec app npx prisma db seed
\`\`\`

### Access Database
\`\`\`bash
# Using psql
docker-compose exec postgres psql -U postgres -d ecommerce_db

# Or use PgAdmin at http://localhost:5050
# Host: postgres
# Port: 5432
# Database: ecommerce_db
# Username: postgres
# Password: postgres
\`\`\`

### Backup Database
\`\`\`bash
# Create backup
docker-compose exec postgres pg_dump -U postgres ecommerce_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres ecommerce_db < backup.sql
\`\`\`

## 🔐 Environment Variables

Environment variables are defined in `docker-compose.yml`. To customize:

1. Create a `.env` file in the root directory
2. Copy variables from `.env.docker`
3. Update `docker-compose.yml` to use `env_file: .env`

## 🏗️ Architecture

### Multi-Stage Dockerfile

The Dockerfile uses a multi-stage build for optimization:

1. **Builder Stage**: Installs dependencies, generates Prisma client, builds TypeScript
2. **Production Stage**: Copies only production dependencies and built code

Benefits:
- Smaller final image size
- Faster container startup
- Better security (no dev dependencies)

### Docker Compose Services

\`\`\`yaml
postgres: PostgreSQL database (port 5432)
app:      NestJS application (port 3000)
pgadmin:  Database management UI (port 5050)
\`\`\`

## 🔍 Troubleshooting

### Port Already in Use
\`\`\`bash
# If port 3000 is in use, change it in docker-compose.yml:
ports:
  - "3001:3000"  # Host:Container
\`\`\`

### Database Connection Issues
\`\`\`bash
# Check if PostgreSQL is healthy
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
\`\`\`

### Application Won't Start
\`\`\`bash
# Check application logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache app
docker-compose up app
\`\`\`

### Clear Everything and Start Fresh
\`\`\`bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose rm -f

# Rebuild and start
docker-compose up --build
\`\`\`

## 🚀 Production Deployment

For production deployment:

1. **Update Environment Variables**
   - Use strong JWT secrets
   - Configure real Stripe keys
   - Set up proper email service
   - Enable SSL for database if needed

2. **Use Production Docker Compose**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d
   \`\`\`

3. **Set Resource Limits**
   Add to docker-compose.yml:
   \`\`\`yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 2G
   \`\`\`

4. **Use Docker Secrets** (for sensitive data)
   \`\`\`bash
   docker secret create db_password ./db_password.txt
   \`\`\`

## 📊 Monitoring

### Health Checks
\`\`\`bash
# Check container health
docker-compose ps

# View health status
docker inspect --format='{{.State.Health.Status}}' ecommerce-app
\`\`\`

### Resource Usage
\`\`\`bash
# View resource usage
docker stats

# View specific container
docker stats ecommerce-app
\`\`\`

## 🔄 Updates and Maintenance

### Update Dependencies
\`\`\`bash
# Update Docker images
docker-compose pull

# Rebuild with new dependencies
docker-compose up --build
\`\`\`

### Clean Up
\`\`\`bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes (⚠️ Be careful!)
docker volume prune
\`\`\`

## 📝 Notes

- Database data persists in Docker volumes even after stopping containers
- To completely reset, use `docker-compose down -v`
- PgAdmin configuration persists in a separate volume
- Application logs are available via `docker-compose logs`

## 🆘 Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Ensure ports are available: `netstat -an | grep 3000`
4. Rebuild without cache: `docker-compose build --no-cache`

## 🎯 Next Steps

After successful Docker setup:

1. Test API endpoints at http://localhost:3000/api/docs
2. Create admin user via API
3. Configure Stripe payment keys (if using payments)
4. Set up email service (if using notifications)
5. Customize environment variables for your needs

---

**Happy Coding! 🚀**
