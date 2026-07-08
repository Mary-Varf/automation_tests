import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    super(page);

    this.page = page;
  }

  async formLayoutPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
    await this.waitForNumberOfSec(1);
  }

  async datepickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }

  async toasterPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  private async selectGroupMenuItem(title: string) {
    const groupMenuItem = this.page.getByTitle(title);
    const expandedState = await groupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") {
      await groupMenuItem.click();
    }
  }
}
