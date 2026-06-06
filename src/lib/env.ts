import { z } from "zod";

const serverEnvSchema = z
  .object({
    GEMINI_API_KEY: z.string().trim().min(1).optional(),
    GOOGLE_API_KEY: z.string().trim().min(1).optional(),
  })
  .refine((env) => env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY, {
    message: "GEMINI_API_KEY or GOOGLE_API_KEY is required.",
  });

export function getGeminiApiKey() {
  const env = serverEnvSchema.parse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  });

  return env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY ?? "";
}
