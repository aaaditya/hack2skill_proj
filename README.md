# AI Kitchen Assistant

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaaditya/hack2skill_proj&env=GEMINI_API_KEY&envDescription=Your%20Gemini%20API%20key%20from%20Google%20AI%20Studio&envLink=https://aistudio.google.com/app/apikey&project-name=ai-kitchen-assistant&repository-name=ai-kitchen-assistant)

A production-ready AI micro-app built with Next.js 15, TypeScript, Tailwind CSS,
and shadcn/ui-style primitives. It generates a personal cooking plan and a
dedicated daily cooking to-do list from a user's budget, ingredients, skill
level, cooking time, dietary preference, and health goal.

## Problem Statement

Build a simple AI micro-app that helps a user generate a personal cooking
to-do list based on their day.

The solution must generate:

- Breakfast Plan
- Lunch Plan
- Dinner Plan
- Grocery List
- Ingredient Substitutions
- Budget Feasibility Logic
- Personal Cooking To-Do List

## Solution Overview

The app collects daily cooking constraints, validates and sanitizes them with
Zod, sends them to a server-side API route, requests structured JSON from Gemini
2.5 Flash, validates the response, then renders clearly labeled output sections.

The mandatory **Today's Cooking To-Do List** is a visually separate responsive
timeline/checklist generated from selected meals, grocery needs, missing
ingredients, available cooking time, and the daily plan.

## Feature List

- Gemini 2.5 Flash server-side API integration
- Breakfast Plan, Lunch Plan, and Dinner Plan cards
- Dedicated Today's Cooking To-Do List timeline/checklist
- Grocery List and Ingredient Substitutions sections
- Budget Feasibility Analysis with deterministic recalculation
- Waste Reduction Score
- Responsive layout and dark mode
- Loading skeletons, safe error states, and focus management
- Strict runtime validation for form inputs and AI responses
- Unit tests and coverage reporting

## Architecture

```text
src/
  app/
    api/kitchen-plan/route.ts     Server API route
    layout.tsx                    App shell and metadata
    page.tsx                      Route entrypoint
  components/
    kitchen-assistant.tsx         Main accessible client experience
    ui/                           shadcn/ui-style primitives
  features/
    kitchen-assistant/api.ts      Typed client API boundary
  lib/
    env.ts                        Environment validation
    rate-limit.ts                 In-memory request throttling
    kitchen/
      budget.ts                   Budget feasibility logic
      gemini.ts                   Prompt and Gemini response schema
      plan.ts                     JSON parsing and alignment enforcement
      schemas.ts                  Zod input/output contracts
      security.ts                 Sanitization and prompt-injection checks
      substitutions.ts            Ingredient substitution engine
      todo.ts                     Cooking to-do list generation
```

## Security Features

- Zod validation for all user inputs
- Safe JSON parsing and API request validation
- Environment variable validation for `GEMINI_API_KEY` / `GOOGLE_API_KEY`
- Input sanitization before prompt construction
- Prompt-injection pattern rejection
- Delimited untrusted user context in prompts
- Server-side Gemini API key only; no client exposure
- Rate limiting on the AI route
- Safe public error messages without stack traces or provider internals
- `npm audit --audit-level=moderate` is clean

## Accessibility Features

- Semantic page structure with main, header, form, section, lists, and time
  elements
- Keyboard-accessible native form controls and buttons
- Error messages use `role="alert"` and `aria-live`
- Focus moves to validation errors and generated results
- Form exposes loading state with `aria-busy`
- Waste score exposes progressbar semantics
- To-do list is an ordered timeline with accessible labels
- Responsive mobile-first layout and high-contrast color tokens

## Testing Information

Unit tests cover:

- Budget feasibility logic
- Ingredient substitution logic
- Form validation and prompt-injection rejection
- API client success and error states
- Grocery list fallback
- Cooking to-do list generation
- JSON response parsing and required section alignment

Commands:

```bash
npm test
npm run test:coverage
```

## Setup Instructions

```bash
npm install
cp .env.example .env.local
```

Add one of the supported API keys:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

or:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open the URL printed by the Next.js dev server.

## Build Instructions

```bash
npm run lint
npm run build
npm run start
```

## Deployment Instructions

### Vercel (recommended)

**One-click deploy:**

Click the **Deploy with Vercel** button at the top of this README.

Vercel will prompt you to enter `GEMINI_API_KEY` before deploying. Paste your
key from [Google AI Studio](https://aistudio.google.com/app/apikey) and click
**Deploy**. No other configuration is needed.

**Manual deploy:**

1. Push this repository to GitHub (already done).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Under **Environment Variables**, add:
   - Name: `GEMINI_API_KEY`
   - Value: your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Click **Deploy**.

The `vercel.json` in this repo configures:
- Build command: `npm run build`
- Install command: `npm install`
- Framework: Next.js
- API function max duration: 60 seconds (allows time for Gemini to respond)

No local database, local files, hardcoded ports, or machine-specific paths are
required. The app works on any reviewer machine with a valid API key.

## How This Solution Meets The Evaluation Criteria

### Code Quality

- Strict TypeScript with no explicit `any` types in `src`
- Reusable components and domain utilities
- Clear separation between UI, API client, validation, Gemini, security,
  budget, substitutions, and to-do generation
- Strong Zod contracts for inputs and structured AI responses

### Security

- Validates, sanitizes, and rate-limits all AI route requests
- Keeps API keys server-side
- Uses safe fallback errors and rejects prompt-injection attempts
- Validates Gemini output before rendering

### Efficiency

- Client-side validation avoids unnecessary API calls
- Memoized result cards reduce avoidable rerenders
- Deterministic budget, grocery fallback, substitution, and to-do logic avoids
  extra model calls
- Structured JSON response reduces parsing retries

### Testing

- Vitest test suite covers the critical scoring logic and error states
- Coverage reporting is available with `npm run test:coverage`

### Accessibility

- Accessible form flow, focus management, ARIA status/error support, progressbar
  semantics, and responsive checklist/timeline output

### Problem Statement Alignment

The UI explicitly labels and renders:

- Breakfast Plan
- Lunch Plan
- Dinner Plan
- Grocery List
- Ingredient Substitutions
- Budget Feasibility Analysis
- Today's Cooking To-Do List