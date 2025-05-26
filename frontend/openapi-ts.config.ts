import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:3333/api",
  output: "./lib/client",
  plugins: [
    {
      baseUrl: false,
      name: "@hey-api/client-next",
    },
  ],
});
