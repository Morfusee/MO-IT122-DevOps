# Docker Development Setup

This Docker configuration enables local development with Traefik reverse proxy routing.  
**Services**: AdonisJS backend + Next.js frontend + MongoDB database

## Quick Start

```bash
# Start all services (Traefik v3 + all apps + database)
docker compose -f compose.dev.yml up --build
```

## Project Structure

```
docker/
├── compose.dev.yml           # Combined dev environment (main setup)
├── compose.temp.yml          # Temporary compose file for testing (Disregard)
├── old.compose.dev.yml       # Old copy of the compose.dev.yml (Disregard)
├── backend/
│   ├── Dockerfile            # AdonisJS production build setup
│   └── compose.dev.yml       # Backend-only dev config (Traefik v2.2)
├── frontend/
│   ├── Dockerfile            # Next.js Docker configuration
│   └── compose.dev.yml       # Frontend-only dev config (Traefik v2.2)
└── database/
    ├── compose.dev.yml       # Database + Backend config
    └── mongo-init.js         # MongoDB initialization script
```

## Services Overview

### 🗃️ MongoDB Database
- **Image**: `mongo:latest`
- **Data Persistence**: 
  - Volume mounted at `./database/mongodb-data`
- **Initialization**:
  - Creates root user from `.env` variables
  - Executes `mongo-init.js` on first run
- **Environment Variables**:
  - `MONGO_INITDB_ROOT_USERNAME`
  - `MONGO_INITDB_ROOT_PASSWORD` 
  - `MONGO_INITDB_DATABASE`

### 🔙 Backend (AdonisJS)
- **URL**: http://localhost:3001
- **Depends on**: MongoDB
- **Dockerfile**:
  - Multi-stage build with PNPM
  - Dependency caching optimization
  - Sets `IS_DOCKERIZED=true` environment variable

### 🖥 Frontend (Next.js)
- **URL**: http://localhost:3002
- **Dockerfile**:
  - Standard Next.js production setup
  - Builds from project root context

## Development Workflow

### Individual Service Development
```bash
# Backend + Database (Traefik v2.2)
cd database
docker compose -f compose.dev.yml up

# Frontend only (Traefik v2.2)
cd frontend
docker compose -f compose.dev.yml up

# Backend only (Traefik v2.2)
cd backend
docker compose -f compose.dev.yml up
```

### Full Environment (Recommended)
```bash
# From docker folder:
docker compose -f compose.dev.yml up --build
```

## Configuration Notes

1. **Environment Variables**  
   Required in root `.env`:
   ```bash
   # MongoDB
   MONGO_INITDB_ROOT_USERNAME=your_root_user
   MONGO_INITDB_ROOT_PASSWORD=your_root_password
   MONGO_INITDB_DATABASE=your_db_name
   
   # Adonis Connection
   IS_DOCKERIZED=true
   MONGODB_URI=mongodb://mongo:27017/your_db_name
   ```

2. **Database Initialization**  
   The `mongo-init.js` script:
   - Creates a root user with read/write privileges
   - Automatically executes on container first run
   - Mounted as Docker entrypoint script

3. **Data Persistence**  
   MongoDB data stored in:
   ```
   docker/database/mongodb-data
   ```

## Troubleshooting
- **Database connection issues**:
  - Verify MongoDB container is running
  - Check `.env` variables match initialization script
  - Ensure network dependencies (`depends_on`)
- **Init script not executing**:
  - Remove existing volumes and rebuild
- **Authentication failures**:
  - Verify credentials match between `.env` and application config