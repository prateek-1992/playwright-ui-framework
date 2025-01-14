import { LoginState } from "../constants/loginState";

export interface LoginScenario {
  username: string;
  password: string;
  expectedCondition: LoginState;
}

export const listOfLoginScenarios: LoginScenario[] = [
  {
    username: "standard_user",
    password: "secret_sauce",
    expectedCondition: LoginState.SUCCESSFULL_LOGIN,
  },
  {
    username: "locked_out_user",
    password: "secret_sauce",
    expectedCondition: LoginState.LOCKED_OUT_STATE,
  },
  {
    username: "problem_user",
    password: "secret_sauce",
    expectedCondition: LoginState.PROBLEM_STATE,
  },
  {
    username: "performance_glitch_user",
    password: "secret_sauce",
    expectedCondition: LoginState.PERFORMANCE_GLITCH,
  },
];
