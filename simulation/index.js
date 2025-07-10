import "dotenv/config";

const BASE_URL = process.env.API_BASE_URL;

const userCreds = {
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
  firstName: "Mark",
  lastName: "Ngo",
};

const dummyChat = { prompt: "Can you teach me about biology?" };

function randomDelay(min = 20, max = 100) {
  return new Promise((res) =>
    setTimeout(res, Math.floor(Math.random() * (max - min + 1)) + min)
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

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

async function getOrCreateChat(headers) {
  const getRes = await fetch(`${BASE_URL}/chats`, { headers });
  const chats = await getRes.json();

  if (Array.isArray(chats) && chats.length > 0) {
    console.log(`Found existing chat: ${chats[0].id}`);
    return chats[0].id;
  }

  console.log("No chat found. Creating one...");
  const createRes = await fetch(`${BASE_URL}/chats`, {
    method: "POST",
    headers,
    body: JSON.stringify(dummyChat),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(
      `Failed to create chat: ${createRes.status} - ${errorText}`
    );
  }

  const data = await createRes.json();
  if (!data.chat || !data.chat.id) {
    throw new Error("Chat creation failed. No chat object returned.");
  }

  return data.chat.id;
}

async function simulateLoop() {
  await registerUser();
  const token = await login();

  const headers = {
    "Content-Type": "application/json",
    cookie: `accessToken=${token}`,
  };

  const chatId = await getOrCreateChat(headers);
  console.log(`Bombarding chat ID: ${chatId}`);

  const tasks = [
    async () => await fetch(`${BASE_URL}/me`, { headers }),
    async () => await fetch(`${BASE_URL}/chats`, { headers }),
    async () => await fetch(`${BASE_URL}/chats/${chatId}`, { headers }),
    async () =>
      await fetch(`${BASE_URL}/chats/${chatId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ name: `Updated ${Date.now()}` }),
      }),
    async () =>
      await fetch(`${BASE_URL}/chats/${chatId}/messages`, { headers }),
  ];

  while (true) {
    try {
      shuffleArray(tasks);
      for (const task of tasks) {
        await task();
        await randomDelay(); // Random delay between requests
      }
      console.log(`[${new Date().toISOString()}] Cycle complete.`);
    } catch (err) {
      console.error("Error during bombardment:", err.message);
    }

    await randomDelay();
  }
}

simulateLoop();
