import type {
  CookingTodoItem,
  KitchenFormValues,
  KitchenPlan,
} from "@/lib/kitchen/schemas";
import { collectMissingIngredients } from "@/lib/kitchen/substitutions";

export function generateCookingTodoList(
  plan: Omit<KitchenPlan, "cookingTodoList">,
  values: Pick<KitchenFormValues, "cookingTime">,
): CookingTodoItem[] {
  const hasGroceries =
    plan.groceryList.length > 0 || collectMissingIngredients(plan).length > 0;
  const dinnerStart = chooseDinnerStart(values.cookingTime);
  const items: CookingTodoItem[] = [
    {
      time: "08:00 AM",
      task: `Prepare ${plan.breakfast.mealName}`,
      category: "Breakfast",
      completed: false,
    },
  ];

  if (hasGroceries) {
    items.push({
      time: "12:30 PM",
      task: `Buy ${formatList(plan.groceryList.length ? plan.groceryList : collectMissingIngredients(plan))}`,
      category: "Groceries",
      completed: false,
    });
  }

  items.push(
    {
      time: "01:00 PM",
      task: `Cook ${plan.lunch.mealName}`,
      category: "Lunch",
      completed: false,
    },
    {
      time: dinnerStart,
      task: `Prepare ${plan.dinner.mealName}`,
      category: "Dinner",
      completed: false,
    },
  );

  return items;
}

function chooseDinnerStart(cookingTime: string) {
  const minutes = Number(cookingTime.match(/\d+/)?.[0] ?? 60);

  if (minutes >= 120) {
    return "07:00 PM";
  }

  if (minutes <= 30) {
    return "08:15 PM";
  }

  return "08:00 PM";
}

function formatList(items: string[]) {
  const uniqueItems = Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

  if (uniqueItems.length === 0) {
    return "missing grocery items";
  }

  if (uniqueItems.length === 1) {
    return uniqueItems[0];
  }

  if (uniqueItems.length === 2) {
    return `${uniqueItems[0]} and ${uniqueItems[1]}`;
  }

  return `${uniqueItems.slice(0, -1).join(", ")}, and ${uniqueItems.at(-1)}`;
}
