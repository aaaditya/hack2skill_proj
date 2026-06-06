import { describe, expect, it } from "vitest";

import { calculateBudgetAnalysis, parseMoneyAmount } from "@/lib/kitchen/budget";

describe("budget calculation", () => {
  it("parses common currency formats", () => {
    expect(parseMoneyAmount("$25.50")).toBe(25.5);
    expect(parseMoneyAmount("USD 1,250.00")).toBe(1250);
    expect(parseMoneyAmount("about 18 dollars")).toBe(18);
  });

  it("marks plans under budget", () => {
    const analysis = calculateBudgetAnalysis("25 USD", "$18");

    expect(analysis.budgetStatus).toBe("Under Budget");
    expect(analysis.savingsOrExcess).toBe("$7.00 savings");
  });

  it("marks plans over budget", () => {
    const analysis = calculateBudgetAnalysis("$20", "$24.75");

    expect(analysis.budgetStatus).toBe("Over Budget");
    expect(analysis.savingsOrExcess).toBe("$4.75 over budget");
  });

  it("marks plans within one dollar as on budget", () => {
    const analysis = calculateBudgetAnalysis("$20", "$20.50");

    expect(analysis.budgetStatus).toBe("On Budget");
    expect(analysis.savingsOrExcess).toBe("Within $1.00 of budget");
  });
});
