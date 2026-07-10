import { test as base } from "@playwright/test";
import { PageManager } from "./page-objects/pageManager";

export type TestOptions = {
  globalQaURL: string;
  conduitQaURL: string;
  formLayoutsPage: string;
  pageManager: PageManager;
};

export const test = base.extend<TestOptions>({
  globalQaURL: ["", { option: true }],
  conduitQaURL: ["", { option: true }],

  formLayoutsPage: [
    async ({ page }, use) => {
      await page.goto("/");
      await page.getByText("Forms").click();
      await page.getByText("Form Layouts").click();
      await use("");
    },
    { auto: true },
  ],
  pageManager: async ({ page, formLayoutsPage }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
