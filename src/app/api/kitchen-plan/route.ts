import { NextRequest, NextResponse } from "next/server";

import { getGeminiApiKey } from "@/lib/env";
import { requestGeminiKitchenPlan } from "@/lib/kitchen/gemini";
import { parseKitchenPlanResponse, formatValidationError } from "@/lib/kitchen/plan";
import { kitchenFormSchema } from "@/lib/kitchen/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch (error) {
    console.warn("Invalid kitchen plan JSON request:", error);

    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const valuesResult = kitchenFormSchema.safeParse(requestBody);

  if (!valuesResult.success) {
    return NextResponse.json(
      { error: formatValidationError(valuesResult.error) },
      { status: 400 },
    );
  }

  let apiKey: string;

  try {
    apiKey = getGeminiApiKey();
  } catch (error) {
    console.error("Kitchen assistant server configuration failed:", error);

    return NextResponse.json(
      { error: "Kitchen assistant is not configured for AI generation." },
      { status: 500 },
    );
  }

  try {
    const rawPlan = await requestGeminiKitchenPlan(valuesResult.data, apiKey);
    const plan = parseKitchenPlanResponse(rawPlan, valuesResult.data);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Kitchen plan generation failed:", error);

    return NextResponse.json(
      { error: "Unable to generate a valid kitchen plan. Please try again." },
      { status: 502 },
    );
  }
}
