import { describe, expect, it } from "vitest";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

describe("rate limiting", () => {
  it("allows requests under the configured limit", () => {
    expect(
      checkRateLimit("allowed-user", { limit: 2, windowMs: 60_000 }),
    ).toEqual({ allowed: true });
    expect(
      checkRateLimit("allowed-user", { limit: 2, windowMs: 60_000 }),
    ).toEqual({ allowed: true });
  });

  it("blocks requests over the configured limit", () => {
    expect(
      checkRateLimit("blocked-user", { limit: 1, windowMs: 60_000 }),
    ).toEqual({ allowed: true });

    const result = checkRateLimit("blocked-user", {
      limit: 1,
      windowMs: 60_000,
    });

    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("extracts client IP from forwarded headers", () => {
    expect(
      getClientIp(
        new Headers({
          "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        }),
      ),
    ).toBe("203.0.113.10");
    expect(getClientIp(new Headers({ "x-real-ip": "198.51.100.7" }))).toBe(
      "198.51.100.7",
    );
    expect(getClientIp(new Headers())).toBe("anonymous");
  });
});
