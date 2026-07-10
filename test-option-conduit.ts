import { test as base } from "@playwright/test";

export type TestOptionsConduit = {
  globalQaURL: string;
  conduitQaURL: string;
};

export const test = base.extend<TestOptionsConduit>({
  globalQaURL: ["", { option: true }],
  conduitQaURL: ["", { option: true }],
});
