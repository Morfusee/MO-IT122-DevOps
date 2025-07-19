# 🖥️ Terminal Assessment

---

## 📌 Agenda / Topics / Activities

- **System Architecture**
- **DevOps Implementation**
- **Live Demonstration**
- **Documentation Overview**
- **Lessons Learned**

---

## 📖 Introduction

### 🌐 Who is BrainBytes Solutions?

- Manila-based EdTech startup
- Founded in 2023 by former educators & tech enthusiasts
- Mission: Make quality tutoring accessible to all Filipino students

---

### 🎯 Core Problem

> Millions of students in the Philippines lack access to affordable, high-quality tutoring — especially in rural areas.

- Educational inequality worsened during the pandemic
- Traditional tutoring is costly & geographically limited

---

### 💡 BrainBytes’ Solution

- AI-powered academic support platform
- 24/7, affordable, accessible tutoring
- Helps students:
  - Understand tough concepts
  - Practice problem-solving
  - Prepare for exams

---

### 🚀 Startup Challenges

- Small team (6 devs + educators)
- Limited funding/resources
- Needs:

  - Reliable platform
  - Fast, efficient deployment
  - Monitoring & scaling

## 🚀 Our Approach to DevOps Implementation

### 📅 Project Timeline (12 Weeks)

- **Weeks 1–3:** MVP Development (Core features, full-stack)
- **Weeks 4–12:** DevOps Integration & Deployment

---

### 👥 Team Roles

- **Mark Rolis Valenzuela** – DevOps Engineer
- **Kristopher Santos** – Team Lead / Coordinator
- **Ibrahim Desouky Harby** – Frontend Developer (Next.js)
- **Harvey Dela Flor** – Backend Developer (AdonisJS)

---

### ⚙️ Approach Highlights

- No strict initial strategy — we worked lean & iterative
- Frontend and backend built MVP collaboratively in first 3 weeks
- DevOps Engineer integrated tools: Docker, GitHub Actions, Prometheus, Grafana
- CI/CD pipeline built after MVP to support ongoing deployment
- Application successfully deployed and monitored by week 12

---

## 🔧 Key Technologies Used

### 🛠️ DevOps Tools

- **Docker** – Containerization for consistent app environments
- **GitHub Actions** – CI/CD automation for building, testing & deploying
- **Prometheus** – System monitoring & metrics collection
- **Grafana** – Visual dashboards for performance and uptime insights

---

### 🧩 Application Stack

- **AdonisJS** – Backend API (Node.js MVC framework)
- **Next.js** – Frontend interface (React-based SSR framework)
- **MongoDB** – NoSQL database for storing user and session data

---

### 🔗 Why These Tools?

- Lightweight & open-source (ideal for a startup)
- Easy to integrate
- Scalable with minimal overhead
- Supports fast iteration & team collaboration

## 🧱 System Architecture

![System Architecture](images/cloud-platform-w-monitoring-architecture.png)

---

## ⚙️ DevOps Implementation

1. Containerization Strategy
2. CI/CD Pipeline Workflow
3. Cloud Deployment Process
4. Monitoring Setup
5. Operation Procedures

---

### 📦 Containerization Strategy

![Containerization Strategy](images/containerization-strategy.png)

---

### 🔁 CI/CD Pipeline Workflow

#### 🛠️ GitHub Actions

- Triggers automatically on pushes to `main` / `develop` branches.
- Runs on Pull Requests targeting protected branches.

![CI/CD Pipeline Diagram](images/pipeline-diagram.png)

---

### ☁️ Cloud Deployment Process

- **Hosting**: OVHCloud Virtual Private Server
  - 2 vCores
  - 2 GB vRAM
  - 40 GB SSD
  - Ubuntu LTS
- **Provisioning**: Ansible
- **Image Updates**: Watchtower
- **Routing & SSL**: Traefik

---

#### 🛠️ Provisioning Process

![Provisioning Process](images/provisioning-process.png)

---

#### 🚀 Push to GHCR

![Push to GHCR](images/push-to-ghcr.png)

---

#### 🔄 GHCR to VPS Deployment

![GHCR to VPS](images/ghcr-to-vps.png)

---

#### 🌐 Updated Images

![Updated Compose Stack](images/updated-compose-stack.png)

---

### 📊 Monitoring Setup

![Monitoring Architecture](images/monitoring-architecture.png)

#### 📈 Dashboards in Grafana

- **DevOps Dashboard**  
  Comprehensive view of application performance (Traefik, AdonisJS metrics).

- **System Stats Dashboard**  
  High-level overview of server health (CPU, memory, disk, network).

- **Traefik Dashboard**  
  Granular HTTP traffic details, error rates, and service performance.

---

### 🔧 Operational Procedures

#### 🛡️ Routine Maintenance

- OS Updates: **Monthly**
- Docker Engine Updates: **Quarterly**
- Container Updates: **Continuous**
- Security Patches: **Immediate**

---

#### ⏪ Rollback Protocol

![Rollback Protocol](images/rollback-protocol.png)

---

#### 🔐 Continuous Security

- Regular updates across stack
- Audit logging enabled
- Network segmentation for monitoring

---

## 🚀 Live Demonstration

_To be presented live._

---

## 📚 Documentation Overview

> ## "The Single Source of Truth"

Our documentation is the blueprint for our platform. It's designed to be:

| 🔍 **Comprehensive**                              | 👥 **Team-Focused**                                    | 🏗️ **Well-Structured**                          |
| :------------------------------------------------ | :----------------------------------------------------- | :---------------------------------------------- |
| Integral to our development process from day one. | Built for developers, operators, and new team members. | Designed for accessibility and easy navigation. |

## **Documentation Structure**

Our documentation is organized into four key pillars to ensure clarity and easy access to information.

| 📚 System & Architecture                                                                                                                                                                                                                                                | 🚀 Deployment & CI/CD                                                                                                                                                                                                                                              |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| • [System Design](./system-design-documentation.md)<br>• [Cloud Environment](./cloud-env-documentation.md)<br>• [Simulation Environment](./simulation-documentation.md)<br><br>**_Focus:_** _Container setup, hosting, networking, security, and service interactions._ | • [Deployment Plan](./deployment-plan-documentation.md)<br>• [CI/CD Workflow](./workflow-documentation.md)<br>• [Docker Setup](./docker-dev-setup.md)<br><br>**_Focus:_** _Automated provisioning, GitHub Actions, and deployment strategies._                     |
| **📊 Monitoring & Alerts**                                                                                                                                                                                                                                              | **🔧 Operations & Support**                                                                                                                                                                                                                                        |
| • [Monitoring Setup](./monitoring-documentation.md)<br>• [Alerting System](./alerts-documentation.md)<br>• [Monitoring Demo](./monitoring-demo-script.md)<br><br>**_Focus:_** _Prometheus metrics, Grafana dashboards, alert rules, and operational playbooks._         | • [Operational Runbook](./operational-runbook.md)<br>• [Troubleshooting Guide](./troubleshooting-guide.md)<br>• [Environment Setup](./environment-setup.md)<br><br>**_Focus:_** _Step-by-step procedures for operations, incident response, and issue resolution._ |

---

## **Operational Runbooks**

> Actionable playbooks for real-world scenarios, designed to standardize procedures and ensure consistency.

| 🔄 **Routine Operations**                                                                   | 🚨 **Incident Response**                                                                |
| :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| [✅ Service Restarts & Updates](./operational-runbook.md#-restart-adonisjs-backend-service) | [🔥 High CPU/Memory Alerts](./operational-runbook.md#-handle-high-cpumemory-usage)      |
| [🔐 SSL Certificate Renewal](./operational-runbook.md#-renew-ssl-certificates)              | [💾 Database Restoration](./operational-runbook.md#-restore-from-backup)                |
| [🔧 System Patching](./operational-runbook.md#-system-patching)                             | [❌ Failed Deployment Rollbacks](./operational-runbook.md#-failed-deployment-rollbacks) |
| [📦 Dependency Management](./operational-runbook.md#-dependency-management)                 | [🧪 CI Test Failure Analysis](./operational-runbook.md#-test-failure-analysis)          |

---

## 💡 Lessons Learned: Challenges & Solutions

| Challenge                                                                                                                        | Solution                                                                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **🔍 Monitoring Complexity**<br>Effectively collecting and visualizing metrics from multiple services (Traefik, AdonisJS, Node). | **✅ Standardized Tooling**<br>Created a detailed metrics catalog and standardized Grafana dashboard templates for consistency.                                  |
| **🛡️ End-to-End Security**<br>Hardening the full stack, from the OS and network to the application layer.                        | **🤖 Automation with Ansible**<br>Automated the entire security setup (UFW, Fail2ban, TLS) for repeatable, secure deployments.                                   |
| **⚙️ CI/CD Pipeline Reliability**<br>Intermittent test failures in GitHub Actions that were not reproducible locally.            | **📝 Robust Analysis Procedures**<br>Developed clear failure analysis procedures, including artifact capture (logs, screenshots) and a local reproduction guide. |

> <br>💡 **Key Insight:** Proactive documentation, especially for runbooks and alerts, was critical to overcoming these challenges and improving team efficiency.

---

## **Future Improvements**

| 📈 Auto-Scaling                                                    | 👁️ Enhanced Observability                                           | 🚀 Advanced Deployments                                              |
| :----------------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------- |
| Implement dynamic resource allocation based on Prometheus metrics. | Integrate centralized logging with a tool like **Loki**.            | Implement **Canary Releases** for safer, incremental updates.        |
| Optimize for both performance and cost-efficiency.                 | Correlate metrics with application logs for faster troubleshooting. | Explore Blue-Green deployment strategies for zero-downtime releases. |

---

<!-- _class: lead -->

# **Q&A**

## Thank You!

_Any Questions?_
