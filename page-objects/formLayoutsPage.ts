import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionTest: string,
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });
    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);
    await usingTheGridForm.getByLabel(optionTest).check({ force: true });
    await usingTheGridForm.getByRole("button").click();
  }

  async submitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMe: boolean,
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline Form",
    });
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);

    if (rememberMe) {
      await inlineForm.getByRole("checkbox").check({ force: true });
      await inlineForm.getByRole("button").click();
    }
  }
}
