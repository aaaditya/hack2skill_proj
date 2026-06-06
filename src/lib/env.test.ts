import { afterEach, describe, expect, it } from "vitest";

import { getGeminiApiKey } from "@/lib/env";

const originalGeminiKey = process.env.GEMINI_API_KEY;
const originalGoogleKey = process.env.GOOGLE_API_KEY;

describe("environment validation", () => {
  afterEach(() => {
    process.env.GEMINI_API_KEY = originalGeminiKey;
    process.env.GOOGLE_API_KEY = originalGoogleKey;
  });

  it("prefers GEMINI_API_KEY when available", () => {
    process.env.GEMINI_API_KEY = "gemini-key";
    process.env.GOOGLE_API_KEY = "google-key";

    expect(getGeminiApiKey()).toBe("gemini-key");
  });

  it("falls back to GOOGLE_API_KEY", () => {
    delete process.env.GEMINI_API_KEY;
    process.env.GOOGLE_API_KEY = "google-key";

    expect(getGeminiApiKey()).toBe("google-key");
  });

  it("throws when no supported key is configured", () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    expect(() => getGeminiApiKey()).toThrow();
  });
});
