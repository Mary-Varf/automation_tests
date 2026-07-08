import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    super(page);

    this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const datepicker = this.page.getByPlaceholder("Form Picker");
    await datepicker.click();

    const expectedDateString = await this.selectDateInCalendar(
      numberOfDaysFromToday,
    );

    await expect(datepicker).toHaveValue(expectedDateString);
  }

  async selectDatepickerWithRangeFromToday(
    startDayFromToday: number,
    endDayFromToday: number,
  ) {
    const rangepicker = this.page.getByPlaceholder("Range Picker");
    await rangepicker.click();
    const expectedStartDateString =
      await this.selectDateInCalendar(startDayFromToday);
    const expectedEndDateString =
      await this.selectDateInCalendar(endDayFromToday);

    await expect(rangepicker).toHaveValue(
      `${expectedStartDateString} - ${expectedEndDateString}`,
    );
  }

  private async selectDateInCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);

    const expectedDate = date.getDate().toString();
    const shortMonth = date.toLocaleString("En-US", { month: "short" });
    const longMonth = date.toLocaleString("En-US", { month: "long" });
    const year = date.getFullYear();
    const expectedDateString = `${shortMonth} ${expectedDate}, ${year}`;

    let calendarMonthAndYear = await this.page
      .locator("nb-calendar-view-mode")
      .textContent();
    const expMonthAndYear = ` ${longMonth} ${year} `;
    while (!calendarMonthAndYear?.includes(expMonthAndYear)) {
      await this.page
        .locator('nb-calendar-pageable-navigation [data-name="chevron-right"]')
        .click();
      calendarMonthAndYear = await this.page
        .locator("nb-calendar-view-mode")
        .textContent();
    }

    await this.page
      .locator(".day-cell.ng-star-inserted")
      .getByText(expectedDate, { exact: true })
      .click();

    return expectedDateString;
  }
}
