import { Locator, Page, test, expect } from "@playwright/test";
import { TimeConstants } from "../constants/timeConstants";

export class BasePageActions {
  constructor(readonly page: Page) {
    this.page = page;
  }

  async waitUntilElementIsPresent(
    locator: Locator,
    options?: { maxTimeout: number }
  ) {
    await locator.waitFor({
      state: "attached",
      timeout:
        options?.maxTimeout ??
        TimeConstants.MAX_TIMEOUT_FOR_ELEMENT_TO_BE_PRESENT,
    });
  }

  async waitUntilElementIsVisible(
    locator: Locator,
    options?: { maxTimeout: number }
  ) {
    await locator.waitFor({
      state: "visible",
      timeout:
        options?.maxTimeout ??
        TimeConstants.MAX_TIMEOUT_FOR_ELEMENT_TO_BE_VISIBLE,
    });
  }

  async waitUntilElementBecomesInvisible(
    locator: Locator,
    options?: { maxTimeout: number }
  ) {
    await locator.waitFor({
      state: "hidden",
      timeout:
        options?.maxTimeout ??
        TimeConstants.MAX_TIMEOUT_FOR_ELEMENT_TO_BECOME_INVISIBLE,
    });
  }

  async resizePage(width: number, height: number) {
    this.page.setViewportSize({ width: width, height: height });
  }

  async reloadPage() {
    await test.step("Going to reload page", async () => {
      await this.page.reload();
    });
  }

  async navigateToUrl(url: string) {
    await test.step(`Navigate to url ${url}`, async () => {
      await this.page.goto(url);
    });
  }

  async waitUntilElementCountReaches(
    locator: Locator,
    expectedElementCount: number
  ) {
    await expect(locator).toHaveCount(expectedElementCount);
  }
}
