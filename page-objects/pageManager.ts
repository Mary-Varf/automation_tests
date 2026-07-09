import { Page, expect } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { FormLayoutsPage } from "./formLayoutsPage";
import { DatepickerPage } from "./datepickerPage";
import { HelperBase } from "./helperBase";

export class PageManager extends HelperBase {
  readonly page: Page;
  private readonly navigationPage: NavigationPage;
  private readonly formLayoutsPage: FormLayoutsPage;
  private readonly datepickerPage: DatepickerPage;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.formLayoutsPage = new FormLayoutsPage(this.page);
    this.datepickerPage = new DatepickerPage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }
  onFormLayoutPage() {
    return this.formLayoutsPage;
  }
  onDatepickerPage() {
    return this.datepickerPage;
  }
}
