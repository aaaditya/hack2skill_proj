import { afterEach, describe, expect, it, vi } from "vitest";

import { generateKitchenPlan } from "@/features/kitchen-assistant/api";
import type { KitchenFormValues, KitchenPlan } from "@/lib/types";

const formValues: KitchenFormValues = {
  budget: "25 USD",
  ingredients: "eggs, rice, spinach",
  skillLevel: "Beginner",
  cookingTime: "45 minutes",
  dietaryPreference: "High protein",
  healthGoal: "Build lean muscle",
};

const plan: KitchenPlan = {
  breakfast: {
    mealType: "Breakfast",
    mealName: "Spinach Eggs",
    cookingTime: "12 minutes",
    ingredients: ["eggs", "spinach"],
    caloriesEstimate: "350",
    missingIngredients: [],
    instructions: ["Cook eggs with spinach."],
  },
  lunch: {
    mealType: "Lunch",
    mealName: "Rice Bowl",
    cookingTime: "18 minutes",
    ingredients: ["rice", "spinach"],
    caloriesEstimate: "500",
    missingIngredients: ["chicken"],
    instructions: ["Cook rice and top with protein."],
  },
  dinner: {
    mealType: "Dinner",
    mealName: "Simple Chicken Dinner",
    cookingTime: "25 minutes",
    ingredients: ["chicken", "spinach"],
    caloriesEstimate: "550",
    missingIngredients: ["chicken"],
    instructions: ["Cook chicken and greens."],
  },
  groceryList: ["chicken"],
  substitutions: [
    {
      ingredient: "chicken",
      substitute: "tofu",
      reason: "Lower-cost protein swap.",
    },
  ],
  budgetAnalysis: {
    estimatedCost: "$18.00",
    budgetStatus: "Under Budget",
    savingsOrExcess: "$7.00 savings",
    notes: "Feasible within budget.",
  },
  cookingTodoList: [
    {
      time: "08:00 AM",
      task: "Prepare Spinach Eggs",
      category: "Breakfast",
      completed: false,
    },
    {
      time: "12:30 PM",
      task: "Buy chicken",
      category: "Groceries",
      completed: false,
    },
    {
      time: "01:00 PM",
      task: "Cook Rice Bowl",
      category: "Lunch",
      completed: false,
    },
    {
      time: "08:00 PM",
      task: "Prepare Simple Chicken Dinner",
      category: "Dinner",
      completed: false,
    },
  ],
  wasteReductionScore: {
    score: 82,
    label: "Good reuse",
    tips: ["Use spinach in multiple meals."],
  },
};

describe("kitchen assistant API client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses successful kitchen plan responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ plan })),
    );

    await expect(generateKitchenPlan(formValues)).resolves.toEqual(plan);
  });

  it("throws safe server error messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ error: "Request body must be valid JSON." }, { status: 400 }),
      ),
    );

    await expect(generateKitchenPlan(formValues)).rejects.toThrow(
      "Request body must be valid JSON.",
    );
  });

  it("rejects malformed successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ plan: { breakfast: plan.breakfast } })),
    );

    await expect(generateKitchenPlan(formValues)).rejects.toThrow();
  });
});
