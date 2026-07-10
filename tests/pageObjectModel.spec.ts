import { test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("navigate to form page @smoke", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formLayoutPage();
  await page.screenshot({ path: "screenshots/formLayoutPage.png" });
  await pm.navigateTo().datepickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toasterPage();

  await pm.navigateTo().tooltipPage();
});

test("parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);
  const randomFullName = faker.person.fullName();
  const randomEmail = `${randomFullName.replace(" ", "")}${faker.number.int(10000)}@test.com`;

  await pm.navigateTo().formLayoutPage();
  await pm
    .onFormLayoutPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      // @ts-ignore
      process.env.USEREMAIL,
      process.env.PASSWORD,
      "Option 1",
    );
  await pm
    .onFormLayoutPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      randomFullName,
      randomEmail,
      true,
    );
  await pm.navigateTo().datepickerPage();
  await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(100);

  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(2, 5);
});
