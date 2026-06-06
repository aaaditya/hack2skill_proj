# AI Kitchen Assistant

A modern AI-powered cooking planner built with Next.js 15, TypeScript,
Tailwind CSS, and shadcn/ui-style components.

## Features

- Daily cooking plan from budget, pantry ingredients, skill level, time,
  dietary preference, and health goal
- Gemini 2.5 Flash server-side API route
- Structured JSON response for breakfast, lunch, dinner, grocery list,
  substitutions, budget feasibility, and waste reduction score
- Responsive layout, dark mode, loading animations, and error handling
- Deployable on Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel

Set `GEMINI_API_KEY` in your Vercel project environment variables before
deploying.