# BrainBytes AI Tutoring Platform: Presentation Outline

---

## 1. Introduction and Project Overview (2-3 minutes)

### Project Vision
- BrainBytes is an AI-powered tutoring platform for Filipino students.
- Goal: Deliver accessible academic assistance via a robust, scalable solution.

### Key Characteristics
- Containerized Architecture (Docker microservices)
- Automated CI/CD (GitHub Actions)
- Cloud Deployment (OVHCloud VPS)
- Security-First Approach (Firewall, intrusion prevention, TLS)

### Milestone 2 Objectives Achieved
- Containerized application with Docker networking
- Automated CI/CD pipeline
- Deployment to OVHCloud VPS
- Security hardening for production
- Monitoring and observability foundations established

### Team and Responsibilities
- Brief introductions to team roles:
  - Team Lead
  - Backend Developer
  - Frontend Developer
  - DevOps Engineer

---

## 2. System Architecture Explanation (3-4 minutes)

### Cloud Platform Architecture
- Overview of OVHCloud VPS hosting all services
- Key components:
  - Docker Runtime
  - socket-proxy
  - mongo
  - reverse-proxy (Traefik)
  - adonisjs (backend)
  - nextjs (frontend)
  - watchtower

- Diagrams:
  - `images/cloud-platform-architecture.png`
  - `images/cloud-platform-w-monitoring-architecture.png`

### Containerized Application Services
- Explanation of each Docker Compose service
- Benefits of containerization: isolation, portability, scalability

### Resource Configuration
- VPS Specs: 2 vCPU, 2GB RAM, 40GB SSD, Ubuntu LTS

### Networking and Security Setup
- Multi-layered security approach via Ansible playbook

**Firewall (UFW):**
- Default-deny policy
- Allowed ports: SSH, HTTP/S

**Intrusion Detection/Prevention (Fail2ban):**
- SSH brute-force protection

**SSH Security Hardening:**
- Key-based authentication
- Root login prohibited

**Application Security (Traefik):**
- TLS enforcement
- Strong cipher suites
- Security headers:
  - HSTS
  - X-XSS-Protection
  - X-Content-Type-Options
  - X-Frame-Options

**Secrets Management:**
- GitHub Actions Secrets (encrypted)
- `.env` file hardening on VPS
- No secrets in version control

---

## 3. DevOps Implementation Demonstration (7-8 minutes)

### CI/CD Pipeline Architecture
- GitHub Actions workflow: `automation.yml`
- Diagram: `images/pipeline-diagram.png`
- Triggers:
  - `push` (main/develop)
  - `pull_request`
  - `workflow_dispatch`

### Key Stages
- **Linting**: Code quality checks using ESLint, Prettier
- **Testing**:
  - Backend: Japa (unit, integration)
  - Frontend: Cypress (component/UI)
- **Build/Push**:
  - Multi-stage Docker builds
  - Push to GitHub Container Registry (GHCR)

### Integration with Containerized Application
- GitHub Actions pushes images to GHCR
- Watchtower automatically pulls and updates containers
- Diagram: `images/gha-to-vps.png`

### Environment Variable Management & Secrets Handling
- Development: `.env`
- CI/CD: GitHub Actions Secrets
- Production: Manual transfer to VPS with `chmod 600`
- Critical secrets:
  - `APP_KEY`
  - `GEMINI_KEY`
  - `MONGO_ATLAS_URI`

### Artifact Management
- Docker images as versioned artifacts in GHCR

### Deployment Process Flow
1. VPS provisioning (Ansible)
2. Image build and push (GitHub Actions)
3. Application update (Watchtower)
4. Traffic management (Traefik)
- Diagram: `images/deployment-process-flow.png`

---

## 4. Operations Capabilities Showcase (3-4 minutes)

### Monitoring and Observability

**Architecture Components:**
- Prometheus: metrics scraper and time series DB
- Grafana: dashboard and visualization
- Node Exporter: system metrics
- AdonisJS App: custom metrics
- Traefik: HTTP request metrics
- Alertmanager: alert routing
- alertmanager-discord-relay: Discord integration

**Diagrams:**
- `images/monitoring-architecture.png`
- `images/cloud-platform-w-monitoring-architecture.png`

### Dashboard Walkthrough (Live Demo Recommended)
- **System Stats Dashboard** (`resource-dashboard.png`): CPU, Memory, Disk, Network usage
- **DevOps Dashboard** (`main-dashboard-2.png`): Traefik services, request stats, status codes
- **Traefik Error Dashboard** (`error-dashboard-2.png`): HTTP error tracking, request/response size insights

### Alerting System
- Defined alerts:
  - NodeDown
  - HighMemoryUsage
  - HighCPUUsage
  - LowDiskSpace
  - HighTraefikErrorRate
  - AppEndpointDown
- Show rules in: `alert-rules-page.png`
- Alert routing explained (e.g., grouped and sent to Discord)
- Outline response procedures for critical alerts

### Troubleshooting Procedures
- Reference troubleshooting matrix:
  - Pipeline failures
  - Container boot issues
  - API errors
  - Unresponsive services (Traefik, app)

### Maintenance Tasks
- Routine updates:
  - OS updates (via package manager)
  - Docker engine
  - Containers (Watchtower handles automation)

---

## 5. Conclusion and Lessons Learned (1-2 minutes)

### Summary of Achievements
- Deployed a secure, scalable AI tutoring platform
- Integrated DevOps best practices
- Ensured observability, security, and maintainability

### Key Takeaways
- Containerization ensures consistency across environments
- CI/CD improves development speed and reliability
- Monitoring helps catch issues early
- Security must be layered and proactive

### Future Enhancements (Optional)
- Mention planned features, scalability options, or AI-related upgrades

### Q&A
- Open floor for discussion and questions
