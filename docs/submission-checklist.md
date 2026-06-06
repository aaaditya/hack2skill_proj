# Final Hackathon Submission Checklist

## Code Quality
- [x] Strict TypeScript is enabled.
- [x] No explicit `any` types are used in `src`.
- [x] API, Gemini, validation, budget, substitution, to-do generation, security, and rate-limit logic are separated into focused modules.
- [x] Package versions are pinned for reproducible installs.
- [x] Production build passes.

## Security
- [x] User inputs are validated with Zod.
- [x] Request JSON is validated before use.
- [x] Environment variables are validated server-side.
- [x] Inputs are sanitized before prompt construction.
- [x] Prompt-injection patterns are rejected.
- [x] Gemini receives untrusted user data in delimited context blocks.
- [x] Public API errors avoid leaking provider, parser, or environment internals.
- [x] API route includes request rate limiting.
- [x] `npm audit --audit-level=moderate` reports zero vulnerabilities.

## Efficiency
- [x] Result cards are memoized to reduce avoidable rerenders.
- [x] Client validates form data before making an API request.
- [x] Gemini is configured for structured JSON with lower temperature.
- [x] Deterministic budget/substitution logic avoids extra AI calls.
- [x] Deterministic grocery fallback and to-do list generation avoid extra AI calls.

## Testing
- [x] Vitest is installed and configured.
- [x] Budget calculation tests pass.
- [x] Substitution engine tests pass.
- [x] Form validation tests pass.
- [x] API response parsing tests pass.
- [x] API client error-state tests pass.
- [x] Grocery list fallback tests pass.
- [x] Cooking to-do list generation tests pass.
- [x] Coverage summary is available with `npm run test:coverage` and reports 90.55% statements / 90.4% lines.
- [x] `npm test` passes.

## Accessibility
- [x] Main content, form, and result region use semantic HTML.
- [x] Error messages use `role="alert"` and `aria-live`.
- [x] Focus moves to errors and generated results.
- [x] Form exposes loading state with `aria-busy`.
- [x] Waste score bar uses `role="progressbar"` with numeric ARIA values.
- [x] Today's Cooking To-Do List uses an ordered timeline with accessible labels and `time` elements.
- [x] Interactive controls are keyboard-accessible native controls.

## Problem Statement Alignment
- [x] Breakfast plan is required and rendered.
- [x] Lunch plan is required and rendered.
- [x] Dinner plan is required and rendered.
- [x] Grocery list is required and rendered.
- [x] Ingredient substitutions are required and rendered.
- [x] Budget analysis is required, recalculated, and rendered.
- [x] Today's Cooking To-Do List is required and rendered as a dedicated section.
- [x] Gemini 2.5 Flash is used through a server-side API route.
- [x] App is deployable on Vercel with `GEMINI_API_KEY` or `GOOGLE_API_KEY`.

## Final Verification Commands
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm test`
- [x] `npm run test:coverage`
- [x] `npm audit --audit-level=moderate`
- [x] Fresh install/build/start path validated.
