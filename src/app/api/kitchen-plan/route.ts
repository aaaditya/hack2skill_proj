import { NextRequest, NextResponse } from "next/server";

import type { KitchenFormValues, KitchenPlan } from "@/lib/types";

export const runtime = "nodejs";

const responseSchema = {
  type: "OBJECT",
  properties: {
    breakfast: mealSchema("Breakfast"),
    lunch: mealSchema("Lunch"),
    dinner: mealSchema("Dinner"),
    groceryList: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    substitutions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          ingredient: { type: "STRING" },
          substitute: { type: "STRING" },
          reason: { type: "STRING" },
        },
        required: ["ingredient", "substitute", "reason"],
      },
    },
    budgetAnalysis: {
      type: "OBJECT",
      properties: {
        estimatedCost: { type: "STRING" },
        budgetStatus: {
          type: "STRING",
          enum: ["Under Budget", "On Budget", "Over Budget"],
        },
        savingsOrExcess: { type: "STRING" },
        notes: { type: "STRING" },
      },
      required: ["estimatedCost", "budgetStatus", "savingsOrExcess", "notes"],
    },
    wasteReductionScore: {
      type: "OBJECT",
      properties: {
        score: { type: "NUMBER" },
        label: { type: "STRING" },
        tips: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
      required: ["score", "label", "tips"],
    },
  },
  required: [
    "breakfast",
    "lunch",
    "dinner",
    "groceryList",
    "substitutions",
    "budgetAnalysis",
    "wasteReductionScore",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const formValues = (await request.json()) as Partial<KitchenFormValues>;
    const validationError = validateRequest(formValues);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GEMINI_API_KEY. Add it to your Vercel project or local .env file.",
        },
        { status: 500 },
      );
    }

    const prompt = buildPrompt(formValues as KitchenFormValues);
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema,
          },
        }),
      },
    );

    const payload = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          error:
            payload.error?.message ??
            "Gemini could not generate a cooking plan right now.",
        },
        { status: geminiResponse.status },
      );
    }

    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 },
      );
    }

    const plan = normalizePlan(JSON.parse(text) as KitchenPlan);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Kitchen plan generation failed:", error);

    return NextResponse.json(
      { error: "Unable to generate your kitchen plan. Please try again." },
      { status: 500 },
    );
  }
}

function mealSchema(mealType: "Breakfast" | "Lunch" | "Dinner") {
  return {
    type: "OBJECT",
    properties: {
      mealType: { type: "STRING", enum: [mealType] },
      mealName: { type: "STRING" },
      cookingTime: { type: "STRING" },
      ingredients: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
      caloriesEstimate: { type: "STRING" },
      missingIngredients: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
      instructions: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
    },
    required: [
      "mealType",
      "mealName",
      "cookingTime",
      "ingredients",
      "caloriesEstimate",
      "missingIngredients",
      "instructions",
    ],
  };
}

function validateRequest(values: Partial<KitchenFormValues>) {
  const requiredFields: (keyof KitchenFormValues)[] = [
    "budget",
    "ingredients",
    "skillLevel",
    "cookingTime",
    "dietaryPreference",
    "healthGoal",
  ];

  for (const field of requiredFields) {
    if (!values[field]?.trim()) {
      return `Please provide ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`;
    }
  }

  return "";
}

function buildPrompt(values: KitchenFormValues) {
  return `
You are an expert AI kitchen assistant. Create a personalized cooking plan for one day.

User constraints:
- Daily budget: ${values.budget}
- Available ingredients: ${values.ingredients}
- Cooking skill level: ${values.skillLevel}
- Available cooking time: ${values.cookingTime}
- Dietary preference: ${values.dietaryPreference}
- Health goal: ${values.healthGoal}

Requirements:
- Recommend breakfast, lunch, and dinner.
- Prefer available ingredients and list missing ingredients clearly.
- Keep methods realistic for the user's skill level and available time.
- Generate a grocery list containing only missing items worth buying today.
- Suggest useful substitutions for missing, expensive, or diet-conflicting ingredients.
- Analyze whether the plan is feasible within the budget.
- Score waste reduction from 0 to 100 based on reuse of available ingredients and leftovers.
- Return only valid JSON matching the provided schema.
`;
}

function normalizePlan(plan: KitchenPlan): KitchenPlan {
  return {
    ...plan,
    breakfast: {
      ...plan.breakfast,
      mealType: "Breakfast",
      missingIngredients: plan.breakfast.missingIngredients ?? [],
      instructions: plan.breakfast.instructions ?? [],
    },
    lunch: {
      ...plan.lunch,
      mealType: "Lunch",
      missingIngredients: plan.lunch.missingIngredients ?? [],
      instructions: plan.lunch.instructions ?? [],
    },
    dinner: {
      ...plan.dinner,
      mealType: "Dinner",
      missingIngredients: plan.dinner.missingIngredients ?? [],
      instructions: plan.dinner.instructions ?? [],
    },
    groceryList: plan.groceryList ?? [],
    substitutions: plan.substitutions ?? [],
    wasteReductionScore: {
      ...plan.wasteReductionScore,
      score: Number(plan.wasteReductionScore.score),
      tips: plan.wasteReductionScore.tips ?? [],
    },
  };
}
