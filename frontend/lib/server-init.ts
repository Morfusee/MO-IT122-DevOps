import nextConfig from "@/next.config";
import { client } from "./client/client.gen";

client.setConfig({
  baseUrl: nextConfig.env?.API_BASE_URL_SERVER,
});

export { client };
