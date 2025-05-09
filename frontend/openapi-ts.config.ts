import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./lib/api-specs.json",
  output: "./lib/client",
  plugins: ["@hey-api/client-fetch"],
});
