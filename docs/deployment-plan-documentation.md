# Production Deployment Plan

## 1. Introduction

Welcome to the deployment playbook for **BrainBytes**, your AI-powered tutoring platform. This guide details our journey from code to a live, production-grade deployment on an **OVHCloud VPS**, ensuring each component is hardened, automated, and monitored.

## 2. Deployment Objectives

Our mission-critical deployment goals:

- **Containerized Microservices**: Launch all app components (frontend, backend, database, proxy) as isolated Docker containers.
- **Seamless CI/CD Integration**: Enable zero-downtime, push-to-deploy capabilities via GitHub Actions.
- **Secure VPS Hosting**: Serve the app reliably on OVHCloud with hardened OS and network layers.
- **Defense-in-Depth Security**: Enforce TLS encryption, firewalls, intrusion prevention, and SSH hardening.
- **Initial Monitoring Setup**: Lay the groundwork for observability using lightweight tools.

## 3. Deployment Environment

![Deployment Process Flow Diagram](images/deployment-process-flow.png) *Figure: Deployment Process Flow Diagram*

### 3.1 Cloud Provider

- **Platform**: OVHCloud VPS  
- **Specs**:
  - vCPU: 2 cores  
  - RAM: 2 GB  
  - Storage: 40 GB SSD  
  - OS: Ubuntu LTS (Minimal)  
  - Runtime: Docker Engine 24.x

### 3.2 Application Stack (Docker Compose)

Services orchestrated with Docker Compose:

- `socket-proxy`: Restricts Docker socket access securely
- `reverse-proxy`: Traefik for HTTPS routing and load balancing
- `mongo`: MongoDB instance
- `adonisjs`: Node.js backend API
- `nextjs`: Next.js frontend
- `watchtower`: Automated container updates

## 4. Deployment Prerequisites

### 4.1 VPS Access

- OVHCloud VPS provisioned and accessible
- Root access (for initial provisioning) and a deployment user created
- SSH key-pair configured and added to `~/.ssh/authorized_keys`

### 4.2 GitHub Configuration

- Project hosted on GitHub with Actions enabled
- The following secrets must be set:

```
GH_PAT: GitHub Personal Access Token (packages:write)
APP_KEY: Encryption key for AdonisJS
GEMINI_KEY: Gemini AI integration key
MONGO_ATLAS_URI: MongoDB Atlas connection string
SSH_PRIVATE_KEY: Key for Ansible to connect to VPS
VPS_USER: Username for deployment
VPS_HOST: Public IP or domain
SSH_PORT: Non-default port (if applicable)
```

### 4.3 Local Ansible Setup

- Ansible installed locally or in CI/CD runner
- SSH config pointing to deployment key

### 4.4 DNS Records

- A Records for:
  - `api.brainbytes.mcoube.uk`
  - `brainbytes.mcoube.uk`

## 5. Deployment Phases

### Phase 1: VPS Provisioning (DevOps)

**Goal**: Bootstrap the VPS with core infrastructure.

**Steps**:

1. Configure inventory:

```ini
[vps_servers]
your_vps_ip ansible_host=[ip_address]
```

2. Run provisioning playbook:

```bash
ansible-playbook playbook.yml -l vps_servers -u [user] --ask-pass
```

Installs:
- Docker + Compose
- UFW, Fail2ban
- SSH hardening
- `/opt/brainbytes` directory
- Transfers `docker-compose.yml` and `.env`

3. Launch services:

```bash
ssh your_ssh_user@your_vps_ip -p your_ssh_port
cd /opt/brainbytes
docker compose up -d
```

4. Confirm Watchtower is active.

---

### Phase 2: CI/CD Pipeline Setup

**Goal**: Configure GitHub Actions to handle automated builds and delivery.

**Tasks**:
- Validate `.github/workflows/automation.yml`
- Add GitHub Secrets
- Push test to trigger workflow

---

### Phase 3: Live Deployment (Automated)

**Goal**: Push updates to production with minimal effort.

**Workflow**:
```bash
git push origin main
```

- GitHub Actions builds Docker images
- Pushes to GHCR
- Watchtower detects updates and redeploys containers

---

### Phase 4: Post-Deployment Validation

**Goal**: Confirm system health and functional correctness.

**Tasks**:

```bash
# Check running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Verify backend
curl -I https://api.brainbytes.mcoube.uk/health

# Logs
docker logs adonisjs
docker logs nextjs
```

---

### Phase 5: Monitoring Stack (Upcoming)

**Goal**: Add observability with Prometheus + Grafana.

**Planned Steps**:
- Deploy Prometheus
- Deploy Grafana
- Configure basic dashboards and alerts

---

## 6. Security Considerations

- **Principle of Least Privilege**:
  - Minimal access for provisioning users
  - Containers run as non-root where possible

- **Secrets Handling**:
  - GitHub Secrets used exclusively
  - `.env` protected with `chmod 600`

- **Network Controls**:
  - UFW limits exposed ports
  - Traefik handles SSL termination and headers

- **Intrusion Mitigation**:
  - Fail2ban monitors and blocks suspicious activity

- **Update Automation**:
  - Watchtower ensures container freshness

---

## 7. Maintenance & Troubleshooting

### 7.1 Routine Maintenance

- **OS**: Monthly updates with `sudo apt update && sudo apt upgrade -y`
- **Docker**: Quarterly
- **Containers**: Auto-managed by Watchtower
- **Security Patches**: Immediate action on discovery

### 7.2 Troubleshooting Guide

Refer to the "Operational Guide" in the [System Design Document](system-design-documentation.md) for:

- Pipeline failures
- Container errors
- API unavailability
- Deployment rollbacks

---