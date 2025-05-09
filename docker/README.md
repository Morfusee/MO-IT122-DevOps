# Docker Development Setup

This Docker configuration enables local development with Traefik reverse proxy routing.  
**Services**: AdonisJS backend + Next.js frontend

## Quick Start

```bash
# Start all services (Traefik v3 + both apps)
docker compose -f compose.dev.yml up --build
```

## Project Structure

```
docker/
├── compose.dev.yml           # Combined dev environment (main setup)
├── backend/
│   ├── Dockerfile            # AdonisJS production build setup
│   └── compose.dev.yml       # Backend-only dev config (Traefik v2.2)
└── frontend/
    ├── Dockerfile            # Next.js Docker configuration
    └── compose.dev.yml       # Frontend-only dev config (Traefik v2.2)
```

## Services Overview

### 🌐 Traefik Reverse Proxy

- Routes traffic based on host headers
- **Dashboard**: http://localhost:8080
- Version: v3 (main setup), v2.2 (individual service setups)

### 🔙 Backend (AdonisJS)

- **URL**: http://adonis.localhost
- **Port**: 3333
- **Dockerfile**:
  - Multi-stage build with PNPM
  - Dependency caching optimization
  - Production-ready final image

### 🖥 Frontend (Next.js)

- **URL**: http://nextjs.localhost
- **Dockerfile**:
  - Standard Next.js production setup
  - Builds from project root context

## Development Workflow

### Individual Service Development

```bash
# Backend only (Traefik v2.2)
cd backend
docker compose -f compose.dev.yml up

# Frontend only (Traefik v2.2)
cd frontend
docker compose -f compose.dev.yml up
```

### Combined Environment (Recommended)

```bash
# From inside the docker folder:
docker compose -f compose.dev.yml up --build
```

## Configuration Notes

1. **Environment Files**  
   Ensure `.env` exists at project root with required variables

2. **Build Contexts**  
   All services build from project root to access shared resources:

   ```yaml
   build:
     context: ../
     dockerfile: docker/[service]/Dockerfile
   ```

3. **Traefik Versions**
   - Combined setup uses Traefik v3
   - Individual service setups use Traefik v2.2

## Troubleshooting

- `Error: Cannot find module` → Rebuild Docker images
- Connection refused → Verify Traefik is running
- Missing env vars → Check root `.env` file exists
