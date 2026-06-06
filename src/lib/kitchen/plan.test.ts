import { describe, expect, it } from "vitest";

import { parseKitchenPlanResponse } from "@/lib/kitchen/plan";
import type { KitchenFormValues } from "@/lib/kitchen/schemas";

const formValues: KitchenFormValues = {
  budget: "25 USD",
  ingredients: "eggs, oats, spinach",
  skillLevel: "Intermediate",
  cookingTime: "60 minutes",
  dietaryPreference: "High protein",
  healthGoal: "Build lean muscle",
};

const rawPlan = {
  breakfast: {
    mealType: "Breakfast",
    mealName: "Spinach Oat Omelet",
    cookingTime: "15 minutes",
    ingredients: ["eggs", "spinach", "oats"],
    caloriesEstimate: "420",
    missingIngredients: ["feta"],
    instructions: ["Cook oats.", "Scramble eggs with spinach."],
  },
  lunch: {
    mealType: "Lunch",
    mealName: "Protein Rice Bowl",
    cookingTime: "20 minutes",
    ingredients: ["rice", "spinach", "chicken"],
    caloriesEstimate: "560",
    missingIngredients: ["chicken"],
    instructions: ["Cook rice.", "Top with protein and greens."],
  },
  dinner: {
    mealType: "Dinner",
    mealName: "Tomato Yogurt Chicken",
    cookingTime: "25 minutes",
    ingredients: ["tomatoes", "yogurt", "chicken"],
    caloriesEstimate: "610",
    missingIngredients: ["tomatoes"],
    instructions: ["Simmer sauce.", "Add chicken and serve."],
  },
  groceryList: ["feta", "chicken", "tomatoes"],
  substitutions: [
    {
      ingredient: "feta",
      substitute: "Greek yogurt",
      reason: "Keeps protein high and cost lower.",
    },
  ],
  budgetAnalysis: {
    estimatedCost: "$18.50",
    budgetStatus: "Under Budget",
    savingsOrExcess: "$6.50 savings",
    notes: "Uses pantry staples.",
  },
  wasteReductionScore: {
    score: 88,
    label: "Strong pantry reuse",
    tips: ["Use spinach across breakfast and lunch."],
  },
};

describe("API response parsing", () => {
  it("parses structured JSON and enforces required problem sections", () => {
    const plan = parseKitchenPlanResponse(JSON.stringify(rawPlan), formValues);

    expect(plan.breakfast.mealType).toBe("Breakfast");
    expect(plan.lunch.mealType).toBe("Lunch");
    expect(plan.dinner.mealType).toBe("Dinner");
    expect(plan.groceryList).toEqual(["feta", "chicken", "tomatoes"]);
    expect(plan.substitutions).toHaveLength(1);
    expect(plan.budgetAnalysis.budgetStatus).toBe("Under Budget");
  });

  it("derives grocery list and substitutions from missing ingredients when absent", () => {
    const plan = parseKitchenPlanResponse(
      JSON.stringify({ ...rawPlan, groceryList: [], substitutions: [] }),
      formValues,
    );

    expect(plan.groceryList).toEqual(["feta", "chicken", "tomatoes"]);
    expect(plan.substitutions.map((item) => item.ingredient)).toEqual([
      "feta",
      "chicken",
      "tomatoes",
    ]);
  });

  it("rejects responses missing a required meal", () => {
    const incompletePlan = {
      lunch: rawPlan.lunch,
      dinner: rawPlan.dinner,
      groceryList: rawPlan.groceryList,
      substitutions: rawPlan.substitutions,
      budgetAnalysis: rawPlan.budgetAnalysis,
      wasteReductionScore: rawPlan.wasteReductionScore,
    };

    expect(() =>
      parseKitchenPlanResponse(JSON.stringify(incompletePlan), formValues),
    ).toThrow();
  });
});
