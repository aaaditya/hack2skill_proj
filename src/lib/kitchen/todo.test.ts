import { describe, expect, it } from "vitest";

import { generateCookingTodoList } from "@/lib/kitchen/todo";
import type { KitchenPlan } from "@/lib/kitchen/schemas";

const basePlan: Omit<KitchenPlan, "cookingTodoList"> = {
  breakfast: {
    mealType: "Breakfast",
    mealName: "Vegetable Poha",
    cookingTime: "15 minutes",
    ingredients: ["poha", "peas"],
    caloriesEstimate: "350",
    missingIngredients: [],
    instructions: ["Cook poha."],
  },
  lunch: {
    mealType: "Lunch",
    mealName: "Jeera Rice",
    cookingTime: "20 minutes",
    ingredients: ["rice", "cumin"],
    caloriesEstimate: "450",
    missingIngredients: ["curd"],
    instructions: ["Cook rice."],
  },
  dinner: {
    mealType: "Dinner",
    mealName: "Dal Tadka",
    cookingTime: "25 minutes",
    ingredients: ["lentils"],
    caloriesEstimate: "500",
    missingIngredients: ["coriander"],
    instructions: ["Simmer dal."],
  },
  groceryList: ["curd", "coriander"],
  substitutions: [],
  budgetAnalysis: {
    estimatedCost: "$12.00",
    budgetStatus: "Under Budget",
    savingsOrExcess: "$8.00 savings",
    notes: "Affordable pantry-forward plan.",
  },
  wasteReductionScore: {
    score: 90,
    label: "Excellent reuse",
    tips: ["Reuse coriander at lunch and dinner."],
  },
};

describe("cooking to-do list generation", () => {
  it("creates a structured daily timeline from meals and groceries", () => {
    const todoList = generateCookingTodoList(basePlan, {
      cookingTime: "60 minutes",
    });

    expect(todoList).toEqual([
      expect.objectContaining({
        time: "08:00 AM",
        task: "Prepare Vegetable Poha",
        category: "Breakfast",
      }),
      expect.objectContaining({
        time: "12:30 PM",
        task: "Buy curd and coriander",
        category: "Groceries",
      }),
      expect.objectContaining({
        time: "01:00 PM",
        task: "Cook Jeera Rice",
        category: "Lunch",
      }),
      expect.objectContaining({
        time: "08:00 PM",
        task: "Prepare Dal Tadka",
        category: "Dinner",
      }),
    ]);
  });

  it("adjusts dinner timing for very limited cooking windows", () => {
    const todoList = generateCookingTodoList(basePlan, {
      cookingTime: "20 minutes",
    });

    expect(todoList.at(-1)).toMatchObject({
      time: "08:15 PM",
      task: "Prepare Dal Tadka",
    });
  });
});
