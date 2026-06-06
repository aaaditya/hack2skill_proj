import { z } from "zod";

import {
  containsPromptInjection,
  sanitizeText,
} from "@/lib/kitchen/security";

export const skillLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const dietaryPreferences = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "High protein",
  "Low carb",
  "Gluten free",
  "Dairy free",
  "Mediterranean",
] as const;

function safeTextSchema(maxLength: number, message: string) {
  return z
    .string()
    .trim()
    .min(1, "This field is required.")
    .max(maxLength, message)
    .transform(sanitizeText)
    .refine((value) => !containsPromptInjection(value), {
      message: "Prompt override instructions are not allowed.",
    });
}

export const kitchenFormSchema = z.object({
  budget: safeTextSchema(80, "Budget must be concise.")
    .refine((value) => /\d/.test(value), "Budget must include a number."),
  ingredients: safeTextSchema(
    1_500,
    "Ingredients must be under 1,500 characters.",
  ),
  skillLevel: z.enum(skillLevels),
  cookingTime: safeTextSchema(80, "Cooking time must be concise."),
  dietaryPreference: z.enum(dietaryPreferences),
  healthGoal: safeTextSchema(
    500,
    "Health goal must be under 500 characters.",
  ),
});

export const mealRecommendationSchema = z.object({
  mealType: z.enum(["Breakfast", "Lunch", "Dinner"]),
  mealName: z.string().trim().min(1),
  cookingTime: z.string().trim().min(1),
  ingredients: z.array(z.string().trim().min(1)).default([]),
  caloriesEstimate: z.string().trim().min(1),
  missingIngredients: z.array(z.string().trim().min(1)).default([]),
  instructions: z.array(z.string().trim().min(1)).min(1).default([]),
});

export const budgetAnalysisSchema = z.object({
  estimatedCost: z.string().trim().min(1),
  budgetStatus: z.enum(["Under Budget", "On Budget", "Over Budget"]),
  savingsOrExcess: z.string().trim().min(1),
  notes: z.string().trim().min(1),
});

export const kitchenPlanSchema = z.object({
  breakfast: mealRecommendationSchema.extend({
    mealType: z.literal("Breakfast"),
  }),
  lunch: mealRecommendationSchema.extend({
    mealType: z.literal("Lunch"),
  }),
  dinner: mealRecommendationSchema.extend({
    mealType: z.literal("Dinner"),
  }),
  groceryList: z.array(z.string().trim().min(1)).default([]),
  substitutions: z
    .array(
      z.object({
        ingredient: z.string().trim().min(1),
        substitute: z.string().trim().min(1),
        reason: z.string().trim().min(1),
      }),
    )
    .default([]),
  budgetAnalysis: budgetAnalysisSchema,
  wasteReductionScore: z.object({
    score: z.coerce.number().min(0).max(100),
    label: z.string().trim().min(1),
    tips: z.array(z.string().trim().min(1)).default([]),
  }),
});

export type KitchenFormValues = z.infer<typeof kitchenFormSchema>;
export type MealRecommendation = z.infer<typeof mealRecommendationSchema>;
export type BudgetAnalysis = z.infer<typeof budgetAnalysisSchema>;
export type KitchenPlan = z.infer<typeof kitchenPlanSchema>;
