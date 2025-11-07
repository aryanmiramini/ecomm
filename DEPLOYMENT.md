# 🚀 ROIDER E-Commerce Platform - Production Deployment Guide

## 📋 Prerequisites

- Docker & Docker Compose installed
- Kavenegar SMS API account
- Domain name (optional)
- SSL certificates (for HTTPS)

## 🔧 Quick Setup

### 1. Configure Environment Variables

Edit `.env.production` and add your actual values:

```bash
# IMPORTANT: Replace with your actual Kavenegar API key
KAVENEGAR_API_KEY=your_actual_kavenegar_api_key_here

# Change database password
DB_PASSWORD=YourStrongPasswordHere

# Generate a secure JWT secret (minimum 32 characters)
JWT_SECRET=generate-a-very-long-random-string-here
```

### 2. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Access URLs

After deployment, access your services at:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Nginx (Production):** http://localhost

## 📱 Kavenegar SMS Configuration

### Getting Your API Key

1. Sign up at [Kavenegar](https://kavenegar.com)
2. Go to [Panel Settings](https://panel.kavenegar.com/client/setting/account)
3. Copy your API key
4. Update `.env.production` with your key

### Test SMS Sending

```bash
# Test via API
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+989123456789"}'
```

## 🐳 Docker Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Database Management
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

### Rebuild Services
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
```

## 🔒 Production Security Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT secret (use: `openssl rand -base64 32`)
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure backup strategy
- [ ] Set up monitoring (e.g., Prometheus, Grafana)
- [ ] Configure log rotation
- [ ] Review CORS settings
- [ ] Enable HTTPS redirect in nginx.conf

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:3000/api/health

# Frontend health
curl http://localhost:3001

# Database health
docker-compose exec postgres pg_isready
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## 🔄 Backup & Restore

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres ecommerce_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres ecommerce_db < backup.sql
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v roider_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
netstat -tulpn | grep :3000

# Kill process
kill -9 <PID>
```

#### 2. Database Connection Failed
```bash
# Check postgres logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d ecommerce_db
```

#### 3. SMS Not Sending
- Check Kavenegar API key is correct
- Verify phone number format (Iranian: +98...)
- Check Kavenegar account balance
- Review backend logs: `docker-compose logs backend`

#### 4. Frontend Build Errors
```bash
# Clear cache and rebuild
docker-compose exec frontend rm -rf .next
docker-compose restart frontend
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# In docker-compose.yml
backend:
  scale: 3  # Run 3 instances
```

### Load Balancing
- Nginx automatically load balances when multiple backend instances are running
- Consider using Docker Swarm or Kubernetes for production

## 🔐 SSL/HTTPS Setup

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `./ssl/` directory
3. Uncomment SSL configuration in `nginx.conf`
4. Update URLs in `.env.production` to use `https://`

## 🌍 Domain Setup

1. Point your domain to server IP
2. Update `nginx.conf` with your domain
3. Update environment variables with production URLs
4. Configure SSL certificates

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review this documentation
- Check service health endpoints
- Verify environment variables

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ All containers are running: `docker-compose ps`
- ✅ Frontend loads at http://localhost:3001
- ✅ API responds at http://localhost:3000/api/products
- ✅ Swagger docs accessible at http://localhost:3000/api/docs
- ✅ Database migrations completed
- ✅ SMS OTP sending works (with valid Kavenegar key)
