import { client } from "./client/client.gen";

client.setConfig({
  baseUrl: process.env.API_BASE_URL_SERVER,
});

export { client };
