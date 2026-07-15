/**
 * Formats a date as a human-readable Spanish string.
 */
export function formatDateEs(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a calorie count for display (e.g. "250 kcal x 1.5 = 375 kcal").
 */
export function formatCalorieEntry(calories: number, servings: number): string {
  return `${calories.toFixed(0)} kcal × ${servings.toFixed(1)} = ${Math.round(calories * servings)} kcal`
}
