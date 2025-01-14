import test from "@playwright/test";
import { LoginStateValidationHelper } from "../validationHelpers/loginStateValidationHelper";
import { listOfLoginScenarios } from "../testData/loginTestData";

let loginStateValidationHelper: LoginStateValidationHelper;

test.describe("Login Scenarios", { tag: "@login" }, () => {
  for (const eachLoginScenario of listOfLoginScenarios) {
    test(
      `Verify Login Scenario for state: ${eachLoginScenario.expectedCondition}`,
      { tag: `@${eachLoginScenario.expectedCondition}` },
      async ({ page }) => {
        loginStateValidationHelper = new LoginStateValidationHelper(page);
        await loginStateValidationHelper.validateLoginStateFor(
          eachLoginScenario
        );
      }
    );
  }
});
