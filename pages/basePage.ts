import { Page, test } from "@playwright/test";
import { BasePageActions } from "./basePageActions";
import { BaseAssertions } from "./baseAssertions";

export abstract class BasePage
  extends BasePageActions
  implements BaseAssertions
{
  constructor(readonly page: Page) {
    super(page);
  }

  abstract isPageLoaded();

  abstract loadPage();
}
