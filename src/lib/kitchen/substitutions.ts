import type { KitchenFormValues, KitchenPlan } from "@/lib/kitchen/schemas";

export type SubstitutionSuggestion = KitchenPlan["substitutions"][number];

const SUBSTITUTION_RULES: Record<string, string> = {
  butter: "olive oil",
  cream: "Greek yogurt",
  milk: "unsweetened oat milk",
  chicken: "tofu",
  beef: "lentils",
  pasta: "brown rice",
  sugar: "mashed banana",
  eggs: "silken tofu",
  bread: "corn tortillas",
  cheese: "nutritional yeast",
};

export function generateSubstitutionSuggestions(
  missingIngredients: string[],
  values: Pick<KitchenFormValues, "dietaryPreference" | "healthGoal">,
) {
  const normalizedGoal = values.healthGoal.toLowerCase();
  const preference = values.dietaryPreference.toLowerCase();

  return uniqueStrings(missingIngredients).slice(0, 8).map((ingredient) => {
    const key = Object.keys(SUBSTITUTION_RULES).find((candidate) =>
      ingredient.toLowerCase().includes(candidate),
    );
    const substitute =
      key !== undefined
        ? SUBSTITUTION_RULES[key]
        : chooseGenericSubstitute(preference, normalizedGoal);

    return {
      ingredient,
      substitute,
      reason: `Fits ${values.dietaryPreference.toLowerCase()} preferences and keeps the plan practical if ${ingredient} is unavailable.`,
    };
  });
}

export function collectMissingIngredients(plan: KitchenPlan) {
  return uniqueStrings([
    ...plan.breakfast.missingIngredients,
    ...plan.lunch.missingIngredients,
    ...plan.dinner.missingIngredients,
  ]);
}

function chooseGenericSubstitute(preference: string, healthGoal: string) {
  if (preference.includes("vegan") || preference.includes("vegetarian")) {
    return "beans or tofu";
  }

  if (preference.includes("low carb")) {
    return "cauliflower rice or leafy greens";
  }

  if (healthGoal.includes("protein")) {
    return "Greek yogurt or canned tuna";
  }

  return "seasonal produce or pantry staples";
}

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}
