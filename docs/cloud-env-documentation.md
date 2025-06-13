# Cloud Environment Documentation

This document details the architecture, resource configuration, networking, and security measures of the BrainBytes AI Tutoring Platform's cloud deployment on OVHCloud.

---

## 1. Cloud Platform Architecture

The BrainBytes AI Tutoring Platform is deployed on a Virtual Private Server (VPS) provided by OVHCloud. The architecture emphasizes containerization with Docker, managed by Docker Compose, and a strong focus on security.

![Cloud Platform Architecture Diagram](images/cloud-platform-architecture.png)

Key components:
- **OVHCloud VPS** hosting all services
- **Docker Runtime** managing containers through compose.prod.yml
- **Services**:
  - socket-proxy (Docker API Proxy)
  - mongo (MongoDB)
  - reverse-proxy (Traefik)
  - adonisjs (AdonisJS backend)
  - nextjs (Next.js frontend)
  - watchtower (automatic updates)
- **Security Layers**:
  - UFW Firewall
  - Fail2ban intrusion prevention
  - SSH hardening

---

## 2. Resource Configuration

The OVHCloud VPS is configured with the following specifications:

| Component         | Specification             | Notes                                 |
|-------------------|---------------------------|---------------------------------------|
| Provider          | OVHCloud                  | Virtual Private Server (VPS)          |
| vCPU              | 2 cores                   | Shared hyperthreading                 |
| RAM               | 2GB                       | DDR4                                  |
| Storage           | 40GB SSD                  | Persistent storage                    |
| OS                | Ubuntu LTS                | Minimal installation                  |
| Container Runtime | Docker Engine 24.x        | N/A                                   |

---

## 3. Networking and Security Setup

The cloud environment implements a multi-layered security approach, automated via an Ansible playbook.

### 3.1. Firewall (UFW)

* **Default-Deny Policy**: All incoming connections are blocked by default.
* **Allowed Ports**:
    * Incoming SSH connections (on a configurable `ssh_port`).
    * Incoming HTTP/HTTPS traffic (ports 80 and 443) for web access, managed by Traefik.
* **Purpose**: Prevents unauthorized access and exposes only necessary services to the public internet.

### 3.2. Intrusion Detection/Prevention (Fail2ban)

* **SSH Brute-Force Protection**: Monitors SSH authentication logs and automatically bans suspicious IP addresses attempting brute-force attacks.
* **UFW Integration**: Uses UFW as the banning action to block malicious IPs at the firewall level.
* **Localhost Whitelist**: Ignores internal IP addresses (`127.0.0.1/8`) to prevent accidental self-bans.
* **Purpose**: Proactively mitigates common network-based attacks.

### 3.3. SSH Security Hardening

* **Password Authentication Disabled**: SSH access is strictly limited to key-based authentication.
* **Root Login Prohibited**: Direct root login is disabled (`PermitRootLogin prohibit-password`). Administrative tasks require logging in as a regular user and then using `sudo`.
* **SSH Key-Based Authentication Enforced**: Only users with pre-configured SSH keys can access the server, enhancing security significantly.
* **Purpose**: Reduces the attack surface for SSH and strengthens access control.

### 3.4. Application Security (via Traefik)

Traefik acts as the edge router and implements several security features:

* **TLS Enforcement**: Enforces TLS 1.2 or higher for all HTTPS traffic, ensuring secure, encrypted communication.
* **Strong Cipher Suites**: Only modern, secure cipher suites are enabled to protect against cryptographic vulnerabilities.
* **Security Headers**: Injects critical HTTP headers to bolster browser-side protections:
    * `Strict-Transport-Security`: Enforces HTTPS via HSTS.
    * `X-XSS-Protection: 1; mode=block`: Blocks reflected XSS attacks.
    * `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing.
    * `X-Frame-Options: DENY`: Blocks clickjacking via iframes.
* **Sensitive File Access Controls**: Middleware rules block direct access to sensitive files like `.env`, `.git`, and `docker-compose.yml`, preventing accidental exposure.
* **Purpose**: Secures application traffic, enhances client-side security, and protects sensitive configuration files.

---

## 4. Deployment Process Flow

The deployment process is designed for continuous delivery and automation:

![Deployment Process Flow](images/deployment-process-flow.png)

1.  **VPS Provisioning**: An Ansible playbook (`playbook.yml`) initially sets up the OVHCloud VPS, including Docker installation, security tool configuration (UFW, Fail2ban), and SSH access setup.
2.  **Image Building & Pushing**: Upon code pushes to `main` or `develop` branches (and on Pull Requests), GitHub Actions builds Docker images for the backend (AdonisJS) and frontend (Next.js) and pushes them to the GitHub Container Registry (GHCR) with the `latest` tag.
3.  **Application Deployment (Automated)**: Watchtower, a service running on the OVHCloud VPS, continuously monitors GHCR for new image versions. When an update is detected, Watchtower automatically pulls the latest image and restarts the corresponding Docker container, ensuring the application is always running the most recent stable version.
4.  **Traffic Management**: Traefik, acting as the reverse proxy on the VPS, handles all incoming HTTP/HTTPS requests. It routes traffic to the correct `adonisjs` (backend) or `nextjs` (frontend) containers and manages SSL certificates using Let's Encrypt.

---

## 5. Containerized Application Services

The application's core services are orchestrated via Docker Compose:

| Service            | Description                                                                                                                              |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `socket-proxy`     | A security measure to prevent direct `docker.sock` mounting, providing a more controlled way for containers to interact with the Docker daemon. |
| `reverse-proxy`    | Uses Traefik to handle ingress traffic, routing, and SSL/TLS termination for the frontend and backend.                                   |
| `mongo`            | The MongoDB database instance, used for persistent data storage.                                                                         |
| `adonisjs`         | The backend application, built with Node.js and the AdonisJS framework.                                                                  |
| `nextjs`           | The frontend application, built with Next.js.                                                                                            |
| `watchtower`       | Continuously monitors for new Docker image versions in the GitHub Container Registry and automatically updates running containers.         |

---

## 6. Monitoring and Observability

While full Grafana and Prometheus integration is planned, immediate monitoring capabilities include:

* **Traefik Dashboard**: Used to observe networking activity, router status, and service health in real-time. This provides immediate insights into traffic flow and potential routing issues.
* **Docker Container Status Checks**: Regular use of `docker ps` on the VPS to verify that all containers are running, healthy, and not experiencing unexpected restarts.

---

## 7. Security Management

Security is paramount and integrated across all layers of the BrainBytes platform.

### 7.1. Network Security

* **Default-Deny Firewall (UFW)**: Ensures that only explicitly allowed ports (SSH, HTTP/HTTPS via Traefik) are open, with all others blocked by default.
* **Fail2ban Intrusion Prevention**: Proactively defends against brute-force attacks by automatically banning malicious IP addresses identified in authentication logs.

### 7.2. Application Security (via Traefik)

* **TLS Enforcement**: All HTTPS traffic is strictly enforced to use TLS 1.2 or higher for robust encryption.
* **Strong Cipher Suites**: Only modern and secure cipher suites are enabled to prevent cryptographic vulnerabilities.
* **Security Headers**: Traefik injects vital HTTP security headers (`Strict-Transport-Security`, `X-XSS-Protection`, `X-Content-Type-Options`, `X-Frame-Options`) to enhance client-side browser protections.
* **Sensitive File Access Controls**: Middleware rules are configured to prevent public access to sensitive files like `.env`, `.git`, and `docker-compose.yml`.

### 7.3. Secrets Management

* **Encrypted GitHub Actions Secrets**: All CI/CD credentials and sensitive environment variables are securely stored as encrypted secrets within GitHub Actions. These are never exposed in logs or committed to version control.
* **Production `.env` File Hardening**: The `.env` file on the VPS containing production secrets is secured with strict file permissions (`chmod 600`), ensuring only the intended system user can access it.
* **No Secrets in Version Control**: A strict policy is maintained to explicitly exclude all sensitive credentials and API keys from Git repositories.