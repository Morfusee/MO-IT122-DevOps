# Simulation Script Documentation

## Overview

This script simulates realistic user interactions with an API-based chat application to generate traffic and test endpoint behavior. It is suitable for:

- Load testing
- Development environment traffic simulation
- Integration and stability checks

The script loops indefinitely and performs varied API operations with randomized timing to mimic organic usage patterns.

---

## File Location

```
simulation/index.js
```

---

## Requirements

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (or your preferred Node.js package manager)
- A `.env` file with the following environment variables:

```env
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

2. **Install dependencies (if needed):**

   ```bash
   pnpm install
   ```

3. **Run the simulation script:**

   ```bash
   pnpm run dev
   ```

   > ⚠️ The script runs indefinitely in a loop. Use `CTRL+C` to stop it manually.

---

## Script Flow

1. **Register user**
   Attempts to register using credentials from `.env`. Silent fail if already exists.

2. **Login user**
   Sends a login request and retrieves an `accessToken`.

3. **Get or create a chat**
   Checks for existing chats. If none exist, it creates one using a default prompt.

4. **Simulation loop**
   In each cycle:

   - Randomly shuffles and performs API requests:

     - `GET /me`
     - `GET /chats`
     - `GET /chats/:id`
     - `PATCH /chats/:id` (renames the chat)
     - `GET /chats/:id/messages`

   - Introduces randomized delays between requests to mimic human usage.

---

## Code Features

### Randomization

- **Delays**: Each API call is followed by a randomized delay (`20ms–100ms`).
- **Shuffling**: Task execution order is randomized per cycle.

### Error Handling

- Network and logical errors are logged but don't interrupt the loop.
- Login errors and missing `accessToken`s throw descriptive messages.

---

## Console Output

You will see output like:

```
No chat found. Creating one...
Bombarding chat ID: abc123
[2025-06-30T10:45:12.654Z] Cycle complete.
```

In case of failures:

```
Error during bombardment: Login failed: 401 - Unauthorized
```

---

## Troubleshooting

| Issue                       | Possible Cause                          | Solution                               |
| --------------------------- | --------------------------------------- | -------------------------------------- |
| `Login failed: 401`         | Wrong credentials or backend issue      | Double-check `.env` credentials        |
| `Failed to create chat`     | Invalid request body or API error       | Confirm backend supports POST `/chats` |
| Script does nothing         | Missing `.env` or wrong path            | Ensure `.env` is in the same folder    |
| Too many requests / blocked | Server rate-limiting or DDoS protection | Add longer delays or limit iterations  |

---
