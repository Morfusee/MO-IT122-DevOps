import { client } from "./client/client.gen";

client.setConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL,
});

export { client };
