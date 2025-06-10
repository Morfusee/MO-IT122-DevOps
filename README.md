# BrainBytes AI Tutoring Platform [![BrainBytes Docker Image Build CI](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml/badge.svg)](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml)

## Project Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

## Documentation
For more in-depth information about BrainBytes, please refer to our dedicated documentation:
* **[Architecture Reference](docs/images/architecture.png)**: Detailed information about the BrainBytes backend API endpoints, request/response formats, and authentication.
* **[Docker Development Setup](docs/docker-dev-setup.md)**: Comprehensive guide on setting up your local development environment using Docker and Traefik, covering services, project structure, and workflow.
* **[BrainBytes Docker CI Documentation](docs/workflow-documentation.md)**: Details the Continuous Integration (CI) pipeline for building and pushing Docker images to the GitHub Container Registry, including triggers, stages, and troubleshooting.
* **[Contribution Guidelines](docs/contributing.md)**: How to set up your development environment, submit changes, and adhere to our coding standards.

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
- Monitoring: TBD

## Project Setup

Get BrainBytes up and running on your local machine with these simple steps.

### Prerequisites

Before you start, make sure you have the following installed:

* **Git**: For cloning the repository.
* **Node.js** (LTS version recommended): Includes npm, which is needed to install pnpm.
* **pnpm**: Our preferred package manager for faster and more efficient dependency management.
    * If you don't have pnpm, you can install it globally via npm:
        ```bash
        npm install -g pnpm
        ```
* **Docker Desktop**: Required to run the application using Docker Compose.

### Installation

1.  **Clone the Repository**

    You can clone the BrainBytes repository using either **GitHub Desktop** or **Git via your terminal**.

    * **Using GitHub Desktop**:
        1.  Open GitHub Desktop.
        2.  Go to **File > Clone Repository**.
        3.  Paste the repository URL:
            ```
            [https://github.com/Morfusee/MO-IT122-DevOps](https://github.com/Morfusee/MO-IT122-DevOps)
            ```
        4.  Choose your desired local path and click **Clone**.

    * **Using Git via terminal**:
        ```bash
        git clone [https://github.com/Morfusee/MO-IT122-DevOps.git](https://github.com/Morfusee/MO-IT122-DevOps.git)
        ```

2.  **Configure Environment Variables**

    Navigate to the root directory of the cloned repository and set up your environment variables.

    * Duplicate the `.env.example` file and rename the copy to `.env`.
    * Open the newly created `.env` file and fill in all the required values, such as database connection strings or API keys.

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
    * **Frontend**: `http://localhost:3000`
    * **Backend API Docs**: `http://localhost:3333/docs`

#### Run with Docker (Containerized)

For a more production-like environment or to ensure consistency across different development setups, you can run BrainBytes using Docker Compose.

1.  Ensure **Docker Desktop** is running on your machine.
2.  From the project's root directory, execute the Docker Compose command:
    ```bash
    pnpm compose
    ```
    This will build the Docker images (if not already built) and start the containers for both the frontend and backend.
3.  Once the containers are up and running, access the application at:
    * **Frontend**: `http://localhost:3002`
    * **Backend API Docs**: `http://localhost:3001/docs`

---