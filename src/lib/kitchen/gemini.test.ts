import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildKitchenPrompt,
  requestGeminiKitchenPlan,
} from "@/lib/kitchen/gemini";
import type { KitchenFormValues } from "@/lib/kitchen/schemas";

const formValues: KitchenFormValues = {
  budget: "25 USD",
  ingredients: "eggs, rice, spinach",
  skillLevel: "Intermediate",
  cookingTime: "60 minutes",
  dietaryPreference: "High protein",
  healthGoal: "Build lean muscle",
};

describe("Gemini kitchen planner", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds a prompt with mandatory to-do-list alignment", () => {
    const prompt = buildKitchenPrompt(formValues);

    expect(prompt).toContain("cookingTodoList");
    expect(prompt).toContain("Today's Cooking To-Do List");
    expect(prompt).toContain("<ingredients>eggs, rice, spinach</ingredients>");
    expect(prompt).toContain("untrusted user data");
  });

  it("returns Gemini text from a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          candidates: [
            {
              content: {
                parts: [{ text: "{\"breakfast\":{}}" }],
              },
            },
          ],
        }),
      ),
    );

    await expect(
      requestGeminiKitchenPlan(formValues, "test-key"),
    ).resolves.toBe("{\"breakfast\":{}}");
  });

  it("throws provider errors without exposing API keys", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              message: "provider rejected request",
            },
          },
          { status: 400 },
        ),
      ),
    );

    await expect(requestGeminiKitchenPlan(formValues, "secret-key")).rejects.toThrow(
      "provider rejected request",
    );
  });

  it("throws on empty Gemini responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ candidates: [] })));

    await expect(requestGeminiKitchenPlan(formValues, "test-key")).rejects.toThrow(
      "Gemini returned an empty response.",
    );
  });
});
