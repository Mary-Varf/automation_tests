import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test.skip("Locator syntax rules", async ({ page }) => {
  await page
    .locator('input[placeholder="Email"].shape-rectangle')
    .first()
    .click();
  page.locator('text("Using")');
  page.locator('text-is("Using")');
});

test.skip("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").first().click();
});

test("Locating child elements", async ({ page }) => {
  await page.locator("nb-card nb-radio :text-is('Option 1')").click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(":text-is('Option 2')")
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputPassword2") })
    .getByRole("textbox", { name: "Password" })
    .first()
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Password" })
    .first()
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();

  await page
    .locator(':text-is("Using the Grid")')
    .locator("..") //one level up
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();
});

test("Reusing locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  const emailValue = "test@test.com";

  await emailField.fill(emailValue);
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();

  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue(emailValue);
});

test("extracting values", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();

  expect(buttonText).toEqual("Submit");

  const allRadioBtnsLabels = await page.locator("nb-radio").allTextContents();
  expect(allRadioBtnsLabels).toContain("Option 1");

  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@tets.com");
  const emailValue = await emailField.inputValue();

  expect(emailValue).toEqual("test@tets.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("assertions", async ({ page }) => {
  const basicFormBtn = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  // General assertions
  const text = await basicFormBtn.textContent();

  expect(text).toEqual("Submit");

  //Locator assertion
  await expect(basicFormBtn).toHaveText("Submit");

  //Soft assertion
  await expect.soft(basicFormBtn).toHaveText("Submit");
  await basicFormBtn.click();
});
