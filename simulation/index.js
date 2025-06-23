import "dotenv/config";

const BASE_URL = process.env.API_BASE_URL;

const userCreds = {
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
  firstName: "Mark",
  lastName: "Ngo",
};

const dummyChat1 = { prompt: "Can you teach me about biology?" };
const dummyChat2 = { prompt: "How does cells work?" };

async function registerUser() {
  try {
    await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userCreds),
    });
  } catch (_) {
    // Ignore if already registered
  }
}

async function login() {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userCreds),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} - ${text}`);
  }

  const data = await res.json();
  if (!data.accessToken) {
    throw new Error("Login response did not contain accessToken");
  }

  return data.accessToken;
}

async function simulate() {
  await registerUser();
  const token = await login();

  const headers = {
    "Content-Type": "application/json",
    cookie: `accessToken=${token}`,
  };

  // Create chat first
  const createRes = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers,
    body: JSON.stringify(dummyChat1),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(
      `Failed to create chat: ${createRes.status} - ${errorText}`
    );
  }

  const data = await createRes.json();
  console.log("Create chat response:", data);

  const { chat } = data;
  if (!chat || !chat.id) {
    throw new Error("Chat creation failed. No chat object returned.");
  }

  // Proceed only after chat is confirmed
  // 1. Get /me
  await fetch(`${BASE_URL}/me`, { headers });

  // 2. Get all chats
  await fetch(`${BASE_URL}/chats`, { headers });

  // 3. Get chat by ID
  await fetch(`${BASE_URL}/chats/${chat.id}`, { headers });

  // 4. Update chat name
  await fetch(`${BASE_URL}/chats/${chat.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name: "Updated from traffic sim" }),
  });

  // 5. Send message
  await fetch(`${BASE_URL}/chats/${chat.id}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(dummyChat2),
  });

  // 6. Get messages
  await fetch(`${BASE_URL}/chats/${chat.id}/messages`, { headers });

  // 7. Delete chat
  await fetch(`${BASE_URL}/chats/${chat.id}`, {
    method: "DELETE",
    headers,
  });

  console.log(`Simulated run finished.`);
}

simulate();