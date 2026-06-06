import type { BudgetAnalysis } from "@/lib/kitchen/schemas";

export type BudgetComputation = BudgetAnalysis & {
  budgetAmount: number;
  estimatedAmount: number;
};

export function parseMoneyAmount(value: string) {
  const normalized = value.replace(/,/g, "");
  const match = normalized.match(/(?:\$|usd\s*)?(\d+(?:\.\d{1,2})?)/i);

  return match ? Number(match[1]) : 0;
}

export function calculateBudgetAnalysis(
  budget: string,
  estimatedCost: string,
): BudgetComputation {
  const budgetAmount = parseMoneyAmount(budget);
  const estimatedAmount = parseMoneyAmount(estimatedCost);
  const difference = Number((budgetAmount - estimatedAmount).toFixed(2));
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  if (difference > 1) {
    return {
      budgetAmount,
      estimatedAmount,
      estimatedCost: formatter.format(estimatedAmount),
      budgetStatus: "Under Budget",
      savingsOrExcess: `${formatter.format(difference)} savings`,
      notes: "The plan is feasible within the stated daily budget.",
    };
  }

  if (difference < -1) {
    return {
      budgetAmount,
      estimatedAmount,
      estimatedCost: formatter.format(estimatedAmount),
      budgetStatus: "Over Budget",
      savingsOrExcess: `${formatter.format(Math.abs(difference))} over budget`,
      notes:
        "The plan exceeds the stated daily budget; use substitutions or reduce premium ingredients.",
    };
  }

  return {
    budgetAmount,
    estimatedAmount,
    estimatedCost: formatter.format(estimatedAmount),
    budgetStatus: "On Budget",
    savingsOrExcess: "Within $1.00 of budget",
    notes: "The plan closely matches the stated daily budget.",
  };
}
