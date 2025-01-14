import { APIRequest, Page, Request, expect } from "@playwright/test";
import { LoginState } from "../constants/loginState";
import { InventoryPage } from "../pages/InventoryPage";
import { LoginPage } from "../pages/loginPage";
import { LoginScenario } from "../testData/loginTestData";

export class LoginStateValidationHelper {
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(private readonly page: Page) {
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  async validateLoginStateFor(eachLoginScenario: LoginScenario): Promise<void> {
    await this.loginPage.loadPage();

    switch (eachLoginScenario.expectedCondition) {
      case LoginState.SUCCESSFULL_LOGIN:
        await this.verifySuccessfullLoginFlow(eachLoginScenario);
        break;
      case LoginState.PROBLEM_STATE:
        await this.verifyProblemStateFlow(eachLoginScenario);
        break;
      case LoginState.PERFORMANCE_GLITCH:
        await this.verifyPerformanceGlitchFlow(eachLoginScenario);
        break;
      case LoginState.LOCKED_OUT_STATE:
        await this.verifyLockedOutState(eachLoginScenario);
        break;
      default:
        throw new Error(
          `Unknown login state: ${eachLoginScenario.expectedCondition}`
        );
    }
  }

  private async verifySuccessfullLoginFlow(
    eachLoginScenario: LoginScenario
  ): Promise<void> {
    await this.loginPage.fillAndSubmitLoginForm({
      userName: eachLoginScenario.username,
      password: eachLoginScenario.password,
    });
    await this.inventoryPage.isPageLoaded();
  }

  private async verifyProblemStateFlow(
    eachLoginScenario: LoginScenario
  ): Promise<void> {
    const listOfImgApiReq: Request[] = [];

    this.page.context().on("request", (req) => {
      if (req.url().includes("/img/") && req.method() === "GET") {
        listOfImgApiReq.push(req);
      }
    });

    await this.loginPage.fillAndSubmitLoginForm({
      userName: eachLoginScenario.username,
      password: eachLoginScenario.password,
    });

    // Wait for all expected API requests or a timeout
    await this.waitForExpectedRequests(listOfImgApiReq, 7);

    let failedImgApiCount = 0;
    for (const eachApi of listOfImgApiReq) {
      const imgApiResp = await eachApi.response();
      if (imgApiResp?.status() === 404) {
        failedImgApiCount++;
      }
    }

    expect(failedImgApiCount).toBe(6);
  }

  private async waitForExpectedRequests(
    requests: Request[],
    expectedCount: number
  ): Promise<void> {
    const timeout = 5000; // 5 seconds
    const startTime = Date.now();

    while (
      requests.length < expectedCount &&
      Date.now() - startTime < timeout
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.page.context().removeAllListeners("request");
  }

  private async verifyPerformanceGlitchFlow(
    eachLoginScenario: LoginScenario
  ): Promise<void> {
    await this.loginPage.fillAndSubmitLoginForm({
      userName: eachLoginScenario.username,
      password: eachLoginScenario.password,
    });

    const largestContentfulPaint = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const largestPaintEntry = entries.at(-1) as
            | PerformanceEntry
            | undefined;
          observer.disconnect();
          resolve(largestPaintEntry?.startTime || 0);
        });

        observer.observe({ type: "largest-contentful-paint", buffered: true });
      });
    });

    expect(largestContentfulPaint).toBeGreaterThanOrEqual(4);
  }

  private async verifyLockedOutState(eachLoginScenario: LoginScenario) {
    await this.loginPage.fillAndSubmitLoginForm({
      userName: eachLoginScenario.username,
      password: eachLoginScenario.password,
    });
    await this.loginPage.verifyErrorMessageIsDisplayedForState(
      eachLoginScenario.expectedCondition
    );
  }
}
