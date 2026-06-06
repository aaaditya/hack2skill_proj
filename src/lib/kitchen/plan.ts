import { ZodError } from "zod";

import { calculateBudgetAnalysis } from "@/lib/kitchen/budget";
import {
  collectMissingIngredients,
  generateSubstitutionSuggestions,
} from "@/lib/kitchen/substitutions";
import {
  type KitchenFormValues,
  type KitchenPlan,
  kitchenPlanSchema,
} from "@/lib/kitchen/schemas";

export function parseKitchenPlanResponse(
  rawText: string,
  values: KitchenFormValues,
) {
  const parsedJson = parseJsonObject(rawText);
  const plan = kitchenPlanSchema.parse(parsedJson);
  const alignedPlan = enforceProblemAlignment(plan, values);

  return kitchenPlanSchema.parse(alignedPlan);
}

export function enforceProblemAlignment(
  plan: KitchenPlan,
  values: KitchenFormValues,
): KitchenPlan {
  const missingIngredients = collectMissingIngredients(plan);
  const fallbackSubstitutions = generateSubstitutionSuggestions(
    missingIngredients,
    values,
  );
  const substitutions = plan.substitutions.length
    ? plan.substitutions
    : fallbackSubstitutions;
  const budgetAnalysis = calculateBudgetAnalysis(
    values.budget,
    plan.budgetAnalysis.estimatedCost,
  );

  return {
    ...plan,
    breakfast: { ...plan.breakfast, mealType: "Breakfast" },
    lunch: { ...plan.lunch, mealType: "Lunch" },
    dinner: { ...plan.dinner, mealType: "Dinner" },
    groceryList: plan.groceryList.length ? plan.groceryList : missingIngredients,
    substitutions,
    budgetAnalysis: {
      estimatedCost: budgetAnalysis.estimatedCost,
      budgetStatus: budgetAnalysis.budgetStatus,
      savingsOrExcess: budgetAnalysis.savingsOrExcess,
      notes:
        plan.budgetAnalysis.notes.trim() || budgetAnalysis.notes,
    },
    wasteReductionScore: {
      ...plan.wasteReductionScore,
      score: Math.min(Math.max(plan.wasteReductionScore.score, 0), 100),
    },
  };
}

export function formatValidationError(error: ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
    .join(" ");
}

function parseJsonObject(rawText: string): unknown {
  try {
    return JSON.parse(rawText);
  } catch {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Gemini response did not contain valid JSON.");
    }

    return JSON.parse(jsonMatch[0]);
  }
}
