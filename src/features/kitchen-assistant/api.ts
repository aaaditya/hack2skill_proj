import { z } from "zod";

import { kitchenPlanSchema } from "@/lib/kitchen/schemas";
import type { KitchenFormValues, KitchenPlan } from "@/lib/types";

const kitchenPlanResponseSchema = z.object({
  plan: kitchenPlanSchema,
});

const kitchenPlanErrorSchema = z.object({
  error: z.string().min(1),
});

export async function generateKitchenPlan(
  values: KitchenFormValues,
): Promise<KitchenPlan> {
  const response = await fetch("/api/kitchen-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data: unknown = await response.json();

  if (!response.ok) {
    const parsedError = kitchenPlanErrorSchema.safeParse(data);
    throw new Error(
      parsedError.success
        ? parsedError.data.error
        : "Unable to generate your plan.",
    );
  }

  return kitchenPlanResponseSchema.parse(data).plan;
}
