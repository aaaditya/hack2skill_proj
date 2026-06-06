import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getGeminiApiKey } from "@/lib/env";
import { requestGeminiKitchenPlan } from "@/lib/kitchen/gemini";
import { parseKitchenPlanResponse, formatValidationError } from "@/lib/kitchen/plan";
import { publicErrorMessage } from "@/lib/kitchen/security";
import { kitchenFormSchema } from "@/lib/kitchen/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(getClientIp(request.headers), {
      limit: 8,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const requestBody: unknown = await request.json();
    const values = kitchenFormSchema.parse(requestBody);
    const rawPlan = await requestGeminiKitchenPlan(values, getGeminiApiKey());
    const plan = parseKitchenPlanResponse(rawPlan, values);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Kitchen plan generation failed:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: formatValidationError(error) },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: publicErrorMessage(error) },
      { status: 500 },
    );
  }
}
