import { describe, expect, it } from "vitest";

import { generateSubstitutionSuggestions } from "@/lib/kitchen/substitutions";

describe("substitution engine", () => {
  it("uses known substitutions for common ingredients", () => {
    const suggestions = generateSubstitutionSuggestions(["butter", "cream"], {
      dietaryPreference: "Mediterranean",
      healthGoal: "Balanced energy",
    });

    expect(suggestions).toEqual([
      expect.objectContaining({
        ingredient: "butter",
        substitute: "olive oil",
      }),
      expect.objectContaining({
        ingredient: "cream",
        substitute: "Greek yogurt",
      }),
    ]);
  });

  it("deduplicates missing ingredients and supports vegan defaults", () => {
    const suggestions = generateSubstitutionSuggestions(["salmon", "salmon"], {
      dietaryPreference: "Vegan",
      healthGoal: "Increase protein",
    });

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      ingredient: "salmon",
      substitute: "beans or tofu",
    });
  });
});
