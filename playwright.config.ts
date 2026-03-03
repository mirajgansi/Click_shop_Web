import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  use: { baseURL: "http://localhost:3000" },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "e2e",
      dependencies: ["setup"],
      use: { storageState: "playwright/.auth/user.json" },
    },
  ],
});
