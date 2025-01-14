import { Page } from "@playwright/test";

export abstract class BaseAssertions {
  constructor(readonly page: Page) {
    this.page = page;
  }

  abstract isPageLoaded();
}
