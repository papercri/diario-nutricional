import type { MealEntry } from '@/types/food'
import type { MealType } from '@/types/user'

/**
 * Returns the percentage of value relative to target, capped at 100.
 */
export function calcPercentage(value: number, target: number): number {
  if (target <= 0) return 0
  return Math.min((value / target) * 100, 100)
}

/**
 * Returns the remaining amount, floored at 0.
 */
export function calcRemaining(consumed: number, target: number): number {
  return Math.max(target - consumed, 0)
}

/**
 * Groups meal entries by their meal type in display order: Desayuno, Comida, Snack, Cena.
 */
export function groupEntriesByMealType(entries: MealEntry[]): Record<MealType, MealEntry[]> {
  const mealOrder: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner']
  const groups = {} as Record<MealType, MealEntry[]>

  for (const type of mealOrder) {
    groups[type] = entries.filter((e) => e.mealType === type)
  }

  return groups
}

/**
 * Sums the total servings across a list of entries.
 */
export function sumServings(entries: MealEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.servings, 0)
}
