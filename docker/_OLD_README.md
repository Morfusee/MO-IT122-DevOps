# Docker Folder Structure and Purpose

This `docker` folder is designed for encapsulating and managing both the frontend and backend applications using Docker Compose.

---

## Folder Structure

```
docker/
│
├── compose.dev.yml   # Docker Compose file for local development/testing
├── frontend/   # Contains Dockerfile and assets for the frontend
└── backend/   # Contains Dockerfile and assets for the backend
```

---

## Purpose

- **Isolation**: Keeps containerization logic separate from the main application source code.
- **Encapsulation**: Both the `frontend` and `backend` services are defined and managed through `compose.dev.yml`.

---

## compose.dev.yml

This file is responsible for:
- Defining services for the **frontend** and **backend**
- Building each service from their respective Dockerfiles (`frontend/Dockerfile`, `backend/Dockerfile`)
- Setting up a network for the services to communicate in a development environment

---

## Usage

From inside the `docker/` directory, run:

```bash
docker compose -f compose.dev.yml up --build
