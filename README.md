# BrainBytes AI Tutoring Platform

## Project Overview

BrainBytes is an AI-powered tutoring platform designed to provide accessible academic assistance to Filipino students. This project implements the platform using modern DevOps practices and containerization.

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

1. **Clone the repository**  
   Use **GitHub Desktop**:

   - Open GitHub Desktop
   - Go to **File > Clone Repository**
   - Paste the repository URL:
     ```
     https://github.com/Morfusee/MO-IT122-DevOps
     ```
   - Choose a local path and click **Clone**

   Or use Git via terminal:

   ```bash
   git clone https://github.com/Morfusee/MO-IT122-DevOps.git
   ```

2. **Create environment variables**

   - Duplicate the .env.example file found in the root directory
   - Fill in any required values in the .env file

3. **Install dependencies**

   - From the project root directory, run:

   ```bash
   pnpm install:all
   ```

   - This command installs all dependencies for both the frontend and backend

4. **Run the app locally**

   - To start both the frontend and backend in development mode:

   ```bash
   pnpm dev
   ```

   - Once running, access the app at:
     - Frontend: http://localhost:3000
     - Backend API Docs: http://localhost:3333/docs

5. **Run the app with Docker**
   - Make sure Docker Desktop is running on your machine
   - Then in the root directory, run:
   ```bash
   pnpm compose
   ```
   - Once running, access the app at:
     - Frontend: http://localhost:3002
     - Backend API Docs: http://localhost:3001/docs
