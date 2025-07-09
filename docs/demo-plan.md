# BrainBytes AI Tutoring Platform: Live Demonstration Plan

---

## 1. Objective

Showcase the BrainBytes AI Tutoring Platform's robust deployment, automated CI/CD, and comprehensive monitoring capabilities, demonstrating a production-ready system.

---

## 2. Target Audience

- Stakeholders  
- Developers  
- Operations Team  

---

## 3. Time Allotment

**30–45 minutes**, matching the Presentation Outline structure:

| Section                                | Time Allotted     |
|----------------------------------------|-------------------|
| Introduction & Project Overview        | 2–3 minutes       |
| System Architecture Explanation        | 3–4 minutes     |
| DevOps Implementation Demonstration    | 7–8 minutes     |
| Operations Capabilities Showcase       | 3–4 minutes     |
| Conclusion & Q&A                       | 1–2 minutes       |

---

## 4. Technical Requirements for Demonstration

### Internet Connection
- Stable and high-speed internet access

### Projector or Screen Sharing
- For displaying the presentation and live demos

### Web Browser
- Chrome or Firefox recommended  
- URLs to access:
  - **BrainBytes Frontend**: `https://brainbytes.mcoube.uk`
  - **Grafana Dashboard**: `GRAFANA_URL_FQDN`
  - **GitHub Actions Workflows** (optional)

### Terminal Access (Optional but Recommended)
- Local development environment with Git and Docker Compose installed
- SSH access to OVHCloud VPS to run:
  - `docker ps`
  - `docker logs`

### Pre-configured Environment
- BrainBytes app (frontend, backend, database) running on OVHCloud VPS
- Prometheus + Grafana stack active and collecting metrics
- Traffic simulation script (`simulation/index.js`) ready for use

---

## 5. Step-by-Step Live Demonstration Plan

### Introduction & Project Overview (2-3 minutes)

- **Presenter**: Introduce the project
- Reference the “Introduction and Project Overview” section of the Presentation Outline
- Emphasize:
  - Project vision
  - Key characteristics
  - Milestone objectives achieved
  - Team roles

---

### System Architecture Explanation (3–4 minutes)

- Walk through the “System Architecture Explanation” section
- **Visual Aids**:
  - `images/cloud-platform-architecture.png`
  - `images/cloud-platform-w-monitoring-architecture.png`
- Discuss:
  - Containerized services
  - VPS specs
  - Security layers:
    - UFW
    - Fail2ban
    - SSH hardening
    - Traefik config
    - Secrets management

---

### DevOps Implementation Demonstration (7-8 minutes)

- Cover the “DevOps Implementation Demonstration” section
- **Visual Aids**:
  - `images/pipeline-diagram.png`
  - `images/gha-to-vps.png`

#### Option 1: Simulate a Push
1. Show a minor change in frontend/backend (e.g., comment)
2. Commit + push to `main`
3. Open GitHub Actions → show triggered workflow (`automation.yml`)
4. Explain:
   - Linting
   - Testing
   - Docker build & push (backend & frontend)
5. While workflow runs:
   - Explain Watchtower deployment process
6. SSH into VPS:
   - Show `docker ps` output

#### Option 2: Show Recent Workflow
- Open recent successful run of `automation.yml`
- Explain:
  - GHCR image push
  - Watchtower update process
- Confirm via `docker ps`

---

### Operations Capabilities Showcase (3-4 minutes)

- Cover “Operations Capabilities Showcase” section
- Live Demo of Grafana Dashboards:
  - Open **Grafana URL**

#### System Stats Dashboard (`resource-dashboard.png`)
- CPU, memory, disk, and network metrics
- Show healthy system state

#### DevOps Dashboard (`main-dashboard-2.png`)
- Most requested services
- Entry point connections
- HTTP status codes (2xx vs others)

#### Traefik Dashboard (`error-dashboard-2.png`)
- HTTP request/response breakdown
- No 5xx errors = good
- Request and response sizes

#### Alerting System
- Show Grafana Alerts or Alerting Dashboard
- Visual: `alert-rules-page.png`
- Explain alert routing (e.g., Discord notifications via Alertmanager)

#### Live Traffic Simulation (Optional)
- Run `simulation/index.js`
- Watch dashboard metrics spike
- Optionally tail logs:
  - `docker

---

### Conclusion & Q&A (1–2 minutes)

- Recap achievements:
  - Scalable, secure platform
  - Effective DevOps processes
  - Real-time monitoring + alerting
- Review lessons learned:
  - Importance of CI/CD
  - Monitoring & observability
  - Security best practices
- Open the floor for Q&A

---

## 6. Backup Plans in Case of Technical Issues

### Internet Connectivity Loss
- Use static slides/screenshots of:
  - Grafana dashboards
  - GitHub Actions logs and runs

### Live Demo Failure (CI/CD or Monitoring)
- Fall back to pre-recorded video walkthroughs or high-res images
- Narrate each phase of the CI/CD and monitoring process

### VPS Unresponsive / App Down
- Explain documented recovery procedures and system resilience
- Emphasize monitoring’s ability to detect and report downtime

### Simulation Script Fails
- Explain its purpose
- Point to existing dashboard metrics to illustrate traffic data

### General Troubleshooting
- Keep:
  - `system-design-documentation.md`
  - `monitoring-documentation.md`
- Be ready to explain:
  - `.env` file handling
  - Secrets management strategy