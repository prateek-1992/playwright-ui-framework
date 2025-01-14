import { Locator, Page, test, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { AppUrl } from "../constants/appUrls";
import { LoginState } from "../constants/loginState";
import { ErrorMessage } from "../constants/errorMessage";

export class LoginPage extends BasePage {
  readonly loginForm: Locator;
  readonly userNameInputBox: Locator;
  readonly passwordInputBox: Locator;
  readonly loginButton: Locator;
  readonly errorButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(readonly page: Page) {
    super(page);
    this.loginForm = this.page.locator(".login-box form");
    this.userNameInputBox = this.loginForm.locator("#user-name");
    this.passwordInputBox = this.loginForm.locator("#password");
    this.loginButton = this.loginForm.locator("#login-button");
    this.errorButton = this.page.locator(".error-button");
    this.errorMessageContainer = this.page.locator("[data-test='error']");
  }

  async isPageLoaded() {
    await test.step(`Verify if login page is loaded`, async () => {
      await expect(this.loginForm).toBeVisible();
    });
  }

  async loadPage() {
    await test.step(`Load the login page`, async () => {
      await this.page.goto(AppUrl.LOGIN_PAGE_URL);
    });
  }

  async fillAndSubmitLoginForm(creds: { userName: string; password: string }) {
    await test.step(`Fill login form for username: ${creds.userName}`, async () => {
      await this.userNameInputBox.fill(creds.userName);
      await this.passwordInputBox.fill(creds.password);
      await this.loginButton.click();
    });
  }

  async verifyErrorMessageIsDisplayedForState(loginState: LoginState) {
    await expect(
      this.errorButton,
      `expecting error button to be visible`
    ).toBeVisible();
    await expect(
      this.errorMessageContainer,
      "Error message container is displayed"
    ).toBeVisible();
    if (loginState === LoginState.LOCKED_OUT_STATE) {
      await expect(this.errorMessageContainer).toContainText(
        ErrorMessage.LOCKED_OUT_ERROR_MESSAGE
      );
    } else if (loginState === LoginState.PASSWORD_MISMATCH) {
      await expect(this.errorMessageContainer).toContainText(
        ErrorMessage.PASSWORD_MISMATCH
      );
    }
  }
}
