import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig<TestOptions>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [
    process.env.CI ? ["dot"] : ["list"],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({ uploadToArgos: !!process.env.CI }),
    ],
  ],
  use: {
    baseURL: "http://localhost:4200",
    globalQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    conduitQaURL: "https://conduit-api.bondaracademy.com/api",
    trace: "on-first-retry",
    extraHTTPHeaders: { Authorization: `Token ${process.env.ACCESS_TOKEN}` },
    video: { mode: "off", size: { width: 1920, height: 1080 } },
    screenshot: "only-on-failure",
  },
  // globalSetup: require.resolve("./global-setup.ts"),
  // globalTeardown: require.resolve("./global-teardown.ts"),

  projects: [
    {
      name: "setup",
      testMatch: "auth.setup.ts",
    },
    {
      name: "articleCleanUp",
      testMatch: "articleCleanUp.setup.ts",
    },
    {
      name: "newArticleSetup",
      testMatch: "newArticle.setup.ts",
      dependencies: ["setup"],
      teardown: "articleCleanUp",
    },

    {
      name: "chromium",
      testIgnore: ["likesCounter.spec.ts", "apiTests.spec.ts"],
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: ".auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "likesCounter",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
      testMatch: "likesCounter.spec.ts",
      dependencies: ["setup", "newArticleSetup"],
    },
    {
      name: "likesCounterGlobal",
      use: { ...devices["Desktop Chrome"], storageState: ".auth/user.json" },
      testMatch: "likesCounterGlobal.spec.ts",
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:4200",
  },
});
