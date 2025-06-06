# BrainBytes Docker Image Build CI Documentation

This document explains the Continuous Integration (CI) setup for building Docker images for the BrainBytes application.

---

## Workflow Status Badge

[![BrainBytes Docker Image Build CI](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml/badge.svg)](https://github.com/Morfusee/MO-IT122-DevOps/actions/workflows/automation.yml)

---

## Workflow

### BrainBytes Docker Image Build CI (`automation.yml`)

**Purpose**: This workflow is responsible for linting the frontend and backend code, and then building and pushing Docker images for both the backend and frontend components of the BrainBytes application to the GitHub Container Registry.

**Triggers**:
* **`push`**: This workflow automatically runs on pushes to the `main` and `develop` branches.
* **`pull_request`**: This workflow also triggers on pull requests targeting the `main` and `develop` branches.
* **`workflow_dispatch`**: This workflow can be manually triggered from the GitHub Actions tab.

**Manual Execution**:
To run this workflow manually:
1.  Go to the "Actions" tab in your GitHub repository.
2.  Select "BrainBytes Docker Image Build CI" from the list of workflows.
3.  Click on "Run workflow".
4.  You can optionally provide the following inputs:
    * **`tag`**: A custom tag for the Docker image (default: "latest"). If left empty, it will default to "latest" for `main` branch pushes and the branch name (e.g., `develop`) for other branches.
    * **`image_path`**: The base path for the Docker image (default: `ghcr.io/morfusee/brainbytes`).

**Stages**:

1.  **`lint` (Code Quality Checks)**:
    * **Purpose**: Ensures code quality by running linting checks on both the frontend and backend.
    * **Runs on**: `ubuntu-latest`
    * **Steps**:
        * Checks out the repository.
        * Sets up Node.js.
        * Installs `pnpm` globally.
        * Caches frontend `pnpm` dependencies (`~/.pnpm-store` and `frontend/node_modules`).
        * Installs frontend dependencies using `pnpm install --no-frozen-lockfile`.
        * Runs frontend linting using `pnpm run lint`.
        * Caches backend `pnpm` dependencies (`~/.pnpm-store` and `backend/node_modules`).
        * Installs backend dependencies using `pnpm install --no-frozen-lockfile`.
        * Runs backend linting using `pnpm run lint`.

2.  **`test` (Run Tests)**:
    * **Purpose**: Executes backend tests.
    * **Runs on**: `ubuntu-latest`
    * **Environment**: GitHub Actions
    * **Environment Variables**: This job uses several environment variables, including `APP_KEY`, `GEMINI_KEY`, `MONGO_ATLAS_URI`, `MONGO_DOCKER_URI`, `HOST`, `LOG_LEVEL`, and `IS_DOCKERIZED`. These are configured through GitHub Secrets and predefined values.
    * **Steps**:
        * Checks out the repository.
        * Sets up Node.js.
        * Installs `pnpm` globally.
        * Installs backend dependencies using `pnpm install --no-frozen-lockfile`.
        * Runs backend tests using `pnpm test`.

3.  **`build` (Build Docker Images)**:
    * **Purpose**: Builds and pushes the Docker images for the backend and frontend services to the GitHub Container Registry.
    * **Runs on**: `ubuntu-latest`
    * **Dependencies**: This job `needs` both the `lint` and `test` jobs to complete successfully.
    * **Environment**: GitHub Actions
    * **Conditional Execution**: This job only runs on pushes to the `main` branch.
    * **Steps**:
        * Checks out the repository.
        * **Sets dynamic tag and image path**: Determines the Docker image tag based on the trigger (manual input, `main` branch uses `latest`, other branches use the branch name) and sets the full image path.
        * Logs in to GitHub Container Registry (`ghcr.io`) using a Personal Access Token (PAT) stored as `secrets.GH_PAT`.
        * Sets up Docker Buildx for efficient Docker builds.
        * **Builds and Pushes Backend Image**: Builds the backend Docker image using the `docker/backend/Dockerfile` and pushes it to the configured image path with the determined tag. Utilizes GitHub Actions cache for efficient builds.
        * **Builds and Pushes Frontend Image**: Builds the frontend Docker image using the `docker/frontend/Dockerfile` and pushes it to the configured image path with the determined tag. Utilizes GitHub Actions cache for efficient builds.


---

## Configuration

### Secrets

* `GH_PAT`: A GitHub Personal Access Token with `package:write` scope to allow pushing Docker images to the GitHub Container Registry. This secret must be configured in your repository's settings.
* `APP_KEY`: Used by the backend application.
* `GEMINI_KEY`: Used by the backend application for Gemini API access.
* `MONGO_ATLAS_URI`: The MongoDB Atlas connection URI for the backend.
* `MONGO_DOCKER_URI`: The MongoDB Docker connection URI for the backend (likely for local or CI testing against a Dockerized MongoDB).


---

## Testing Strategy

The current CI workflow now includes a dedicated **`test`** job, which primarily focuses on backend testing.

* **Frontend Testing**: Frontend tests are currently executed manually during development.
* **Backend Testing**: Backend tests are now integrated into the CI workflow.
    * **Challenge**: A significant challenge in the past was dealing with backend tests that did not terminate on their own. This has been addressed to allow for automated execution within the `test` job.

---

## Challenges Encountered

1.  **Non-Terminating Backend Tests (Addressed)**: Previously, the backend test suite contained tests that did not automatically terminate, making automation difficult. This issue has been resolved, enabling the `test` job to run successfully within the CI.
2.  **Workflow Iteration Requiring Pushes**: A common challenge encountered during the development and refinement of this GitHub Actions workflow is the need to push changes to the repository for each iteration of testing. This means that even minor adjustments to the `automation.yml` file require a commit and push to trigger a new workflow run, which can still slow down the debugging and development process.

---

## Troubleshooting

### Common Issues

1.  **Linting Failures**:
    * Check the `lint` job logs for specific ESLint errors.
    * Ensure your local environment passes linting before pushing by running `pnpm run lint` in both `frontend` and `backend` directories.
2.  **Test Failures**:
    * Review the `test` job logs for specific errors from the backend test suite.
    * Verify that all required environment variables (e.g., `APP_KEY`, `GEMINI_KEY`, MongoDB URIs) are correctly configured as secrets in your GitHub repository.
    * Ensure backend dependencies are correctly installed before running tests.
3.  **Docker Build Failures**:
    * **Authentication Issues**: Verify that the `GH_PAT` secret is correctly configured and has the necessary `package:write` permissions.
    * **Dockerfile Errors**: Review the `docker/backend/Dockerfile` and `docker/frontend/Dockerfile` for any syntax errors or missing dependencies.
    * **Context Issues**: Ensure all necessary files are included in the build context.

### Getting Help

If you encounter issues with this workflow:
1.  Check the "Actions" tab in your repository for detailed logs of the failed workflow run.
2.  Consult the GitHub Actions documentation for general troubleshooting.
3.  Contact the repository maintainers for assistance.