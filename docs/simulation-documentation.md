# Simulation Script Documentation

## Overview

This script simulates realistic user interactions with an API-based chat application for the purpose of testing and generating traffic. It performs the following:

- User registration and login
- Chat creation
- Retrieval and update of chat data
- Sending and retrieving messages
- Cleanup by deleting the chat

This script is ideal for load testing, development environment traffic simulation, and basic integration checks.

---

## File Location

```
simulation/index.js
```

---

## Requirements

- [Node.js](https://nodejs.org/) installed
- [pnpm](https://pnpm.io/) as the package manager
- `.env` file with the following environment variables:

```

API_BASE_URL=https://api.brainbytes.mcube.uk
TEST_EMAIL=test@email.com
TEST_PASSWORD=yourpassword

```

---

## How to Run

1. **Navigate to the `simulation` folder**:

   ```bash
   cd simulation
   ```

2. **Install dependencies (if you haven’t already):**

   ```bash
   pnpm install
   ```

3. **Run the simulation script:**

   ```bash
   pnpm run dev
   ```

---

## Script Breakdown

### 1. `.env` Usage

The script reads these values from your `.env` file:

- `API_BASE_URL`: Base URL of the backend API
- `TEST_EMAIL` & `TEST_PASSWORD`: Credentials for simulated user

### 2. User Flow

The simulation follows this sequence:

1. **Register** the user (silently fails if already exists)
2. **Login** and retrieve an `accessToken`
3. **Create a chat**
4. Perform the following actions using the `accessToken`:
   - Fetch `/me`
   - Get all chats
   - Get specific chat by ID
   - Update chat name
   - Send a message
   - Retrieve messages
   - Delete the chat

---

## Output

You will see console logs like:

```
Create chat response: { chat: { id: "abc123", ... } }
Simulated run finished.
```

---

## Troubleshooting

- Ensure `.env` is correctly configured in the `simulation` directory.
- Make sure the API server is running and accessible at `API_BASE_URL`.
- If you see `Login failed: 401`, check the credentials in `.env`.

---
