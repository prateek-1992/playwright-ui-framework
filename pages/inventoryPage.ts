import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { AppUrl } from "../constants/appUrls";

export class InventoryPage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  async isPageLoaded() {
    await expect(this.page).toHaveURL(AppUrl.INVENTORY_PAGE_URL);
  }

  async loadPage() {
    await this.page.goto(AppUrl.INVENTORY_PAGE_URL);
  }
}
