import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successBtn = page.locator(".bg-success");

  // await successBtn.click();

  // await successBtn.waitFor({ state: "attached" });

  // const text = await successBtn.textContent();
  // expect(text).toEqual("Data loaded with AJAX get request.");

  await expect(successBtn).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test("alternative waits", async ({ page }) => {
  const successBtn = page.locator(".bg-success");

  //wait for el
  // await page.waitForSelector(".bg-success");
  // const text = await successBtn.textContent();
  // expect(text).toEqual("Data loaded with AJAX get request.");

  //wait for response
  // await page.waitForResponse("http://uitestingplayground.com/ajaxdata");
  // const text = await successBtn.textContent();
  // expect(text).toEqual("Data loaded with AJAX get request.");

  // wait for network calls to be completed

  await page.waitForLoadState("networkidle");
  const text = await successBtn.textContent();
  expect(text).toEqual("Data loaded with AJAX get request.");
});
