"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Apple,
  ChefHat,
  Clock3,
  DollarSign,
  Leaf,
  Loader2,
  Moon,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import type { BudgetAnalysis, KitchenFormValues, KitchenPlan, MealRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const defaultValues: KitchenFormValues = {
  budget: "25 USD",
  ingredients: "eggs, oats, spinach, rice, tomatoes, chicken breast, yogurt",
  skillLevel: "Intermediate",
  cookingTime: "60 minutes total",
  dietaryPreference: "High protein",
  healthGoal: "Build lean muscle while keeping meals balanced",
};

const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const dietaryPreferences = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "High protein",
  "Low carb",
  "Gluten free",
  "Dairy free",
  "Mediterranean",
];

export function KitchenAssistant() {
  const [values, setValues] = useState<KitchenFormValues>(defaultValues);
  const [plan, setPlan] = useState<KitchenPlan | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("kitchen-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(storedTheme ? storedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("kitchen-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const missingCount = useMemo(() => {
    if (!plan) {
      return 0;
    }

    return [
      ...plan.breakfast.missingIngredients,
      ...plan.lunch.missingIngredients,
      ...plan.dinner.missingIngredients,
    ].filter(Boolean).length;
  }, [plan]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/kitchen-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to generate your plan.");
      }

      setPlan(data.plan);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while preparing your plan.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateValue(field: keyof KitchenFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-2xl shadow-black/5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="w-fit" variant="success">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Gemini 2.5 Flash cooking planner
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                AI Kitchen Assistant
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Turn today&apos;s budget, pantry, schedule, and goals into a
                practical breakfast, lunch, dinner, grocery list, substitutions,
                and waste-conscious plan.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? "Light" : "Dark"} mode
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Personalize your day
              </CardTitle>
              <CardDescription>
                Share realistic constraints so Gemini can optimize meals,
                budget, and grocery needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <Field label="Daily budget" htmlFor="budget">
                  <Input
                    id="budget"
                    value={values.budget}
                    onChange={(event) => updateValue("budget", event.target.value)}
                    placeholder="e.g. 20 USD"
                    required
                  />
                </Field>

                <Field label="Available ingredients" htmlFor="ingredients">
                  <Textarea
                    id="ingredients"
                    value={values.ingredients}
                    onChange={(event) =>
                      updateValue("ingredients", event.target.value)
                    }
                    placeholder="List pantry ingredients separated by commas"
                    required
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Field label="Cooking skill" htmlFor="skillLevel">
                    <Select
                      id="skillLevel"
                      value={values.skillLevel}
                      onChange={(event) =>
                        updateValue("skillLevel", event.target.value)
                      }
                    >
                      {skillLevels.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Cooking time" htmlFor="cookingTime">
                    <Input
                      id="cookingTime"
                      value={values.cookingTime}
                      onChange={(event) =>
                        updateValue("cookingTime", event.target.value)
                      }
                      placeholder="e.g. 45 minutes"
                      required
                    />
                  </Field>
                </div>

                <Field label="Dietary preference" htmlFor="dietaryPreference">
                  <Select
                    id="dietaryPreference"
                    value={values.dietaryPreference}
                    onChange={(event) =>
                      updateValue("dietaryPreference", event.target.value)
                    }
                  >
                    {dietaryPreferences.map((preference) => (
                      <option key={preference}>{preference}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Health goal" htmlFor="healthGoal">
                  <Textarea
                    id="healthGoal"
                    value={values.healthGoal}
                    onChange={(event) =>
                      updateValue("healthGoal", event.target.value)
                    }
                    placeholder="e.g. Maintain energy and reduce sodium"
                    required
                  />
                </Field>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                    {error}
                  </div>
                ) : null}

                <Button className="w-full" disabled={loading} size="lg" type="submit">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Preparing your plan
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate cooking plan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <section className="space-y-6">
            {loading ? <LoadingState /> : null}

            {!loading && !plan ? <EmptyState /> : null}

            {plan ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricCard
                    icon={<DollarSign className="h-5 w-5" />}
                    label="Estimated cost"
                    value={plan.budgetAnalysis.estimatedCost}
                  />
                  <MetricCard
                    icon={<Apple className="h-5 w-5" />}
                    label="Waste score"
                    value={`${plan.wasteReductionScore.score}/100`}
                  />
                  <MetricCard
                    icon={<Utensils className="h-5 w-5" />}
                    label="Missing items"
                    value={String(missingCount)}
                  />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                  <MealCard meal={plan.breakfast} />
                  <MealCard meal={plan.lunch} />
                  <MealCard meal={plan.dinner} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <BudgetCard analysis={plan.budgetAnalysis} />
                  <WasteCard score={plan.wasteReductionScore} />
                  <ListCard
                    title="Smart grocery list"
                    description="Only buy what the meal plan cannot cover from your pantry."
                    items={plan.groceryList}
                    icon={<Utensils className="h-5 w-5 text-primary" />}
                  />
                  <SubstitutionCard substitutions={plan.substitutions} />
                </div>
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  children,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MealCard({ meal }: { meal: MealRecommendation }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{meal.mealType}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            {meal.cookingTime}
          </span>
        </div>
        <CardTitle>{meal.mealName}</CardTitle>
        <CardDescription>{meal.caloriesEstimate} calories estimate</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <PillGroup title="Ingredients" items={meal.ingredients} />
        <PillGroup
          emptyLabel="No missing ingredients"
          title="Missing ingredients"
          items={meal.missingIngredients}
          variant="warning"
        />
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick method</h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            {meal.instructions.map((step, index) => (
              <li className="flex gap-2" key={`${meal.mealName}-${step}`}>
                <span className="font-semibold text-primary">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

function PillGroup({
  emptyLabel,
  items,
  title,
  variant = "default",
}: {
  emptyLabel?: string;
  items: string[];
  title: string;
  variant?: "default" | "warning";
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <Badge key={item} variant={variant === "warning" ? "warning" : "default"}>
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">{emptyLabel}</span>
        )}
      </div>
    </div>
  );
}

function BudgetCard({ analysis }: { analysis: BudgetAnalysis }) {
  const variant =
    analysis.budgetStatus === "Over Budget"
      ? "destructive"
      : analysis.budgetStatus === "On Budget"
        ? "warning"
        : "success";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Budget feasibility
        </CardTitle>
        <CardDescription>
          Estimated spend compared with your daily budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoBlock label="Estimated cost" value={analysis.estimatedCost} />
          <InfoBlock
            label="Budget status"
            value={<Badge variant={variant}>{analysis.budgetStatus}</Badge>}
          />
          <InfoBlock label="Savings / excess" value={analysis.savingsOrExcess} />
        </div>
        <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
          {analysis.notes}
        </p>
      </CardContent>
    </Card>
  );
}

function WasteCard({
  score,
}: {
  score: KitchenPlan["wasteReductionScore"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Waste reduction score
        </CardTitle>
        <CardDescription>{score.label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(Math.max(score.score, 0), 100)}%` }}
          />
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {score.tips.map((tip) => (
            <li className="flex gap-2" key={tip}>
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ListCard({
  description,
  icon,
  items,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  items: string[];
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SubstitutionCard({
  substitutions,
}: {
  substitutions: KitchenPlan["substitutions"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredient substitutions</CardTitle>
        <CardDescription>
          Practical swaps for missing, expensive, or diet-conflicting items.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {substitutions.map((substitution) => (
          <div
            className="rounded-2xl border border-border bg-background/50 p-4"
            key={`${substitution.ingredient}-${substitution.substitute}`}
          >
            <p className="font-semibold">
              {substitution.ingredient}{" "}
              <span className="text-muted-foreground">→</span>{" "}
              {substitution.substitute}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {substitution.reason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-lg font-bold">{value}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <Card className="overflow-hidden" key={item}>
          <CardHeader>
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-3/4 animate-pulse rounded-lg bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-20 animate-pulse rounded-2xl bg-muted" />
            <div className="h-16 animate-pulse rounded-2xl bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_28rem)] opacity-10" />
      <CardContent className="relative flex min-h-[520px] flex-col items-center justify-center p-8 text-center">
        <div className="mb-5 rounded-full bg-primary/10 p-5 text-primary">
          <ChefHat className="h-12 w-12" />
        </div>
        <h2 className="max-w-xl text-3xl font-bold tracking-tight">
          Your personalized cooking plan will appear here.
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Generate a structured AI response with meal cards, grocery list,
          substitutions, budget feasibility, and a waste reduction score.
        </p>
        <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
          {["Breakfast", "Lunch", "Dinner"].map((meal) => (
            <div
              className={cn(
                "rounded-2xl border border-dashed border-border bg-background/50 p-5",
                "text-sm font-semibold text-muted-foreground",
              )}
              key={meal}
            >
              {meal}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
