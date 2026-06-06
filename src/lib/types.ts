export type KitchenFormValues = {
  budget: string;
  ingredients: string;
  skillLevel: string;
  cookingTime: string;
  dietaryPreference: string;
  healthGoal: string;
};

export type MealRecommendation = {
  mealType: "Breakfast" | "Lunch" | "Dinner";
  mealName: string;
  cookingTime: string;
  ingredients: string[];
  caloriesEstimate: string;
  missingIngredients: string[];
  instructions: string[];
};

export type BudgetAnalysis = {
  estimatedCost: string;
  budgetStatus: "Under Budget" | "On Budget" | "Over Budget";
  savingsOrExcess: string;
  notes: string;
};

export type KitchenPlan = {
  breakfast: MealRecommendation;
  lunch: MealRecommendation;
  dinner: MealRecommendation;
  groceryList: string[];
  substitutions: {
    ingredient: string;
    substitute: string;
    reason: string;
  }[];
  budgetAnalysis: BudgetAnalysis;
  wasteReductionScore: {
    score: number;
    label: string;
    tips: string[];
  };
};
