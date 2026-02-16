# 🐳 DOCKER DEPLOYMENT GUIDE

## Prerequisites

Before you start, make sure you have Docker installed:

1. **Download Docker Desktop:**
   - Windows: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop

2. **Verify Installation:**
   ```powershell
   docker --version
   docker-compose --version
   ```

---

## 🚀 Quick Start with Docker

### Method 1: Using Docker Compose (Recommended)

**This is the easiest way!** Docker Compose will start both MongoDB and your application automatically.

#### Step 1: Build and Start
```powershell
cd c:\Users\V.S.BARATH\Desktop\digital_waste_management
docker-compose up -d
```

#### Step 2: Check Status
```powershell
docker-compose ps
```

You should see:
- `waste_management_app` - Running on port 3000
- `waste_management_db` - MongoDB running on port 27017

#### Step 3: Access Application
Open your browser and go to:
```
http://localhost:3000
```

#### Step 4: View Logs
```powershell
# View all logs
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# View database logs only
docker-compose logs -f mongodb
```

#### Step 5: Stop Containers
```powershell
# Stop but keep data
docker-compose stop

# Stop and remove containers (keeps data in volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

---

### Method 2: Manual Docker Commands

#### Step 1: Create Network
```powershell
docker network create waste_management_network
```

#### Step 2: Start MongoDB
```powershell
docker run -d `
  --name waste_management_db `
  --network waste_management_network `
  -p 27017:27017 `
  -v mongodb_data:/data/db `
  mongo:7.0
```

#### Step 3: Build Application Image
```powershell
docker build -t waste-management-app .
```

#### Step 4: Run Application
```powershell
docker run -d `
  --name waste_management_app `
  --network waste_management_network `
  -p 3000:3000 `
  -e MONGODB_URI=mongodb://waste_management_db:27017/waste_management `
  -e JWT_SECRET=your_super_secret_jwt_key_change_this_in_production `
  -e ADMIN_EMAIL=admin@waste.com `
  -e ADMIN_PASSWORD=admin123 `
  waste-management-app
```

#### Step 5: Access Application
```
http://localhost:3000
```

---

## 📋 Docker Commands Cheat Sheet

### Container Management
```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop waste_management_app

# Start a container
docker start waste_management_app

# Restart a container
docker restart waste_management_app

# Remove a container
docker rm waste_management_app
```

### Logs & Debugging
```powershell
# View logs
docker logs waste_management_app

# Follow logs in real-time
docker logs -f waste_management_app

# View last 100 lines
docker logs --tail 100 waste_management_app

# Execute commands inside container
docker exec -it waste_management_app sh

# Access MongoDB shell
docker exec -it waste_management_db mongosh
```

### Image Management
```powershell
# List images
docker images

# Remove an image
docker rmi waste-management-app

# Rebuild image (no cache)
docker build --no-cache -t waste-management-app .
```

### Volume Management
```powershell
# List volumes
docker volume ls

# Inspect volume
docker volume inspect mongodb_data

# Remove volume (WARNING: Deletes data!)
docker volume rm mongodb_data
```

---

## 🔧 Configuration

### Environment Variables

You can modify environment variables in `docker-compose.yml`:

```yaml
environment:
  - PORT=3000
  - MONGODB_URI=mongodb://mongodb:27017/waste_management
  - JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
  - JWT_EXPIRE=7d
  - ADMIN_EMAIL=admin@waste.com
  - ADMIN_PASSWORD=admin123
```

### Port Configuration

To change the application port, update in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Access app on port 8080
```

---

## 🗄️ Data Persistence

MongoDB data is stored in a Docker volume named `mongodb_data`. This means:
- ✅ Data persists even if containers are stopped
- ✅ Data persists even if containers are removed
- ✅ Data is only deleted if you run `docker-compose down -v`

### Backup Database
```powershell
# Backup to file
docker exec waste_management_db mongodump --out=/data/backup

# Copy backup to host
docker cp waste_management_db:/data/backup ./backup
```

### Restore Database
```powershell
# Copy backup to container
docker cp ./backup waste_management_db:/data/backup

# Restore from backup
docker exec waste_management_db mongorestore /data/backup
```

---

## 🚀 Production Deployment

### Using Docker Hub

#### Step 1: Build and Tag
```powershell
docker build -t yourusername/waste-management:latest .
```

#### Step 2: Push to Docker Hub
```powershell
docker login
docker push yourusername/waste-management:latest
```

#### Step 3: Deploy on Server
```bash
# On your production server
docker pull yourusername/waste-management:latest
docker-compose up -d
```

### Using a Cloud Platform

#### **Deploy to Heroku:**
```powershell
# Install Heroku CLI
# Then:
heroku container:login
heroku create waste-management-app
heroku container:push web
heroku container:release web
```

#### **Deploy to DigitalOcean:**
- Use DigitalOcean App Platform
- Connect your GitHub repository
- Select Dockerfile deployment
- Set environment variables
- Deploy!

#### **Deploy to AWS ECS:**
- Push to Amazon ECR
- Create ECS Task Definition
- Deploy to ECS Service

---

## 🐛 Troubleshooting

### Issue: Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Issue: Cannot Connect to MongoDB
```powershell
# Check if MongoDB container is running
docker ps | findstr mongodb

# Check MongoDB logs
docker logs waste_management_db

# Restart MongoDB
docker restart waste_management_db
```

### Issue: Application Error
```powershell
# Check app logs
docker logs waste_management_app

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Issue: Docker Desktop Not Running
```powershell
# Start Docker Desktop from Windows Start Menu
# Or:
"C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

---

## 📊 Health Checks

Add health checks to `docker-compose.yml`:

```yaml
app:
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

---

## 🔒 Security Best Practices

1. **Change Default Credentials:**
   - Update `ADMIN_PASSWORD` in production
   - Use strong `JWT_SECRET`

2. **Use Environment Files:**
   ```powershell
   # Create .env.production
   docker-compose --env-file .env.production up -d
   ```

3. **Don't Expose MongoDB Port:**
   ```yaml
   # Remove this in production:
   # ports:
   #   - "27017:27017"
   ```

4. **Use Docker Secrets:**
   ```yaml
   secrets:
     jwt_secret:
       file: ./jwt_secret.txt
   ```

---

## 📈 Scaling

### Scale Application Instances
```powershell
# Run 3 instances of the app
docker-compose up -d --scale app=3
```

### Use Load Balancer
Add nginx reverse proxy in `docker-compose.yml`

---

## ✅ Complete Production Setup

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    networks:
      - backend
    # Don't expose port in production

  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/waste_management
    depends_on:
      - mongodb
    networks:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mongodb_data:

networks:
  backend:
```

---

## 🎉 Benefits of Docker

✅ **Consistency** - Same environment everywhere  
✅ **Easy Deployment** - One command to start  
✅ **Isolation** - No conflicts with other apps  
✅ **Scalability** - Easy to scale up  
✅ **Portability** - Run anywhere Docker runs  
✅ **No MongoDB Installation** - Everything in containers  

---

## 🚀 Quick Commands Summary

```powershell
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Access application
# http://localhost:3000
```

---

**Your application is now Dockerized!** 🐳🎉

Just run `docker-compose up -d` and you're ready to go!
