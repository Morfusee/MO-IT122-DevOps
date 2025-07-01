# BrainBytes AI Tutoring Platform [![BrainBytes Docker Image Build CI](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml/badge.svg)](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml)

## Project Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Documentation

Explore the documentation to understand how **BrainBytes** is architected, deployed, and developed.

### Technical Guides

- **[System Architecture and Design Documentation](docs/system-design-documentation.md)**  
  Learn how the BrainBytes platform is structured—covering backend APIs, data flow, authentication mechanisms, and overall infrastructure. This document also includes two key items users often look for: **System Architecture Documentation** and **Security Implementation Documentation**.

- **[Pipeline Configuration/Cloud Environment Documentation](docs/cloud-env-documentation.md)**  
  Configuration details for hosting BrainBytes on a secure cloud environment.

- **[Deployment Process Documentation](docs/deployment-plan-documentation.md)**  
  Step-by-step deployment process, from VPS setup to CI/CD integration, using Docker Compose and GitHub Actions.

- **[Monitoring System Documentation](docs/monitoring-documentation.md)**  
  Understand how BrainBytes ensures reliability and visibility through robust monitoring and alerting.

  - **[Alerts Documentation](docs/monitoring-documentation.md#4-alert-rules-documentation)**  
    Clear procedures for each Prometheus alert, including what it means, common causes, how to troubleshoot, and how to resolve it.

  - **[Dashboard Catalog](docs/monitoring-documentation.md#5-dashboard-catalog)**  
    Overview of key Grafana dashboards, including their purpose, key metrics tracked, and operational use cases.

- **[Simulation/Data Generator Documentation](docs/simulation-documentation.md)**  
  A detailed guide for running the API simulation script used for testing and traffic generation.

- **[Docker Development Setup](docs/docker-dev-setup.md)**  
  Get started with local development using Docker and Traefik. Includes service structure, workflow tips, and environment management.

- **[GitHub Actions Workflow Documentation](docs/workflow-documentation.md)**  
  Documentation of the GitHub Actions pipeline for automated builds and deployments using GHCR.

### Visual References

- **[Architecture Diagram](docs/images/architecture.png)**  
  High-level visual of the platform’s microservices, ingress, databases, and CI/CD flow.

- **[Cloud Platform Architecture](docs/images/cloud-platform-architecture.png)**  
  Overview of the cloud infrastructure used to host BrainBytes, including virtual machines, networking, and security layers.

- **[Deployment Architecture/Process Flow Diagram](docs/images/deployment-process-flow.png)**  
  A step-by-step visual representation of how BrainBytes is deployed — from code commit to production.

- **[Pipeline Diagram](docs/images/pipeline-diagram.png)**  
  Illustrates the CI/CD pipeline stages, automation triggers, and artifact flow using GitHub Actions and GHCR.

- **[Rollback Protocol Diagram](docs/images/rollback-protocol.png)**  
  Visual guide showing the rollback strategy and process in case of deployment failure or critical issues.

## Important Files

These files define and support the core automation and infrastructure setup of the project.

- **[GitHub Actions Workflow file (`automation.yml`)](.github/workflows/automation.yml)**  
  Main GitHub Actions workflow responsible for CI/CD, including linting, testing, Docker builds, and remote deployment.

- **[Docker Compose File (`docker.prod.compose.yml`)](docker/compose.prod.yml)**  
  Defines all microservices and supporting containers used in production.

- **[Ansible Playbook File(`playbook.yml`)](ansible/playbooks/playbook.yml)**  
  Ansible playbook used to provision the production VPS with required packages, security hardening, and initial app setup.

- **[Screenshot of Cloud Dashboard and Testing Results (Validation Report)](https://docs.google.com/document/d/1gfU2dtmo8PnKXEZZlr5iMl9UzHSvCOctWRax_l4ybCU/edit?usp=sharing)**  
  Contains visual evidence of successful deployment and testing.

- **[Monitoring System Demonstration Script](./docs/monitoring-demo-script.md)**  
  A step-by-step guide for delivering a 10–15 minute live demo of BrainBytes’ monitoring capabilities.

- **Dashboard JSON Exports**
  - [main-dashboard.json](./docker/dashboards/main-dashboard.json)
  - [resource-dashboard.json](./docker/dashboards/resource-optimization.json)
  - [error-dashboard.json](./docker/dashboards/error-analysis.json)

## Team Members

- Kristopher Santos - Team Lead - lr.ksantos@mmdc.mcl.edu.ph
- Harvey Dela Flor - Backend Developer - lr.hdflor@mmdc.mcl.edu.ph
- Ibrahim Desouky Harby - Frontend Developer - lr.idesoukyharby@mmdc.mcl.edu.ph
- Mark Rolis Valenzuela - DevOps Engineer - lr.mrvalenzuela@mmdc.mcl.edu.ph

## Project Goals

- Implement a containerized application with proper networking
- Create an automated CI/CD pipeline using GitHub Actions
- Deploy the application to a Virtual Private Server (VPS)
- Set up monitoring and observability tools

## Technology Stack

- Frontend: Next.js
- Backend: Node.js
- Database: MongoDB Atlas
- Containerization: Docker
- CI/CD: GitHub Actions
- VPS Provider: OVHCloud
- Monitoring: Prometheus and Grafana

## Project Setup

Get BrainBytes up and running on your local machine with these simple steps.

### Prerequisites

Before you start, make sure you have the following installed:

- **Git**: For cloning the repository.
- **Node.js** (LTS version recommended): Includes npm, which is needed to install pnpm.
- **pnpm**: Our preferred package manager for faster and more efficient dependency management.
  - If you don't have pnpm, you can install it globally via npm:
    ```bash
    npm install -g pnpm
    ```
- **Docker Desktop**: Required to run the application using Docker Compose.

### Installation

1.  **Clone the Repository**

    You can clone the BrainBytes repository using either **GitHub Desktop** or **Git via your terminal**.

    - **Using GitHub Desktop**:

      1.  Open GitHub Desktop.
      2.  Go to **File > Clone Repository**.
      3.  Paste the repository URL:
          ```
          [https://github.com/Morfusee/MO-IT122-DevOps](https://github.com/Morfusee/MO-IT122-DevOps)
          ```
      4.  Choose your desired local path and click **Clone**.

    - **Using Git via terminal**:
      ```bash
      git clone [https://github.com/Morfusee/MO-IT122-DevOps.git](https://github.com/Morfusee/MO-IT122-DevOps.git)
      ```

2.  **Configure Environment Variables**

    Navigate to the root directory of the cloned repository and set up your environment variables.

    - Duplicate the `.env.example` file and rename the copy to `.env`.
    - Open the newly created `.env` file and fill in all the required values, such as database connection strings or API keys.

3.  **Install Dependencies**

    From the **root directory** of your project, run the following command to install all necessary dependencies for both the frontend and backend:

    ```bash
    pnpm install:all
    ```

    This command leverages pnpm workspaces to efficiently install dependencies across your monorepo.

### Running the Application

You have two options for running the BrainBytes application locally: directly in development mode or using Docker Compose.

#### Run Locally (Development Mode)

This method is ideal for active development, as it allows for hot-reloading and easy debugging.

1.  From the project's root directory, start both the frontend and backend services:
    ```bash
    pnpm dev
    ```
2.  Once the services are running, access the application at the following URLs:
    - **Frontend**: `http://localhost:3000`
    - **Backend API Docs**: `http://localhost:3333/docs`

#### Run with Docker (Containerized)

For a more production-like environment or to ensure consistency across different development setups, you can run BrainBytes using Docker Compose.

1.  Ensure **Docker Desktop** is running on your machine.
2.  From the project's root directory, execute the Docker Compose command:
    ```bash
    pnpm compose
    ```
    This will build the Docker images (if not already built) and start the containers for both the frontend and backend.
3.  Once the containers are up and running, access the application at:
    - **Frontend**: `http://localhost:3002`
    - **Backend API Docs**: `http://localhost:3001/docs`

---
