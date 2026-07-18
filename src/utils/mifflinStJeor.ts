import type { UserProfile, CalorieGoals } from '../types/user'

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

const goalAdjustments: Record<string, number> = {
  lose: 0.8,
  maintain: 1,
  gain: 1.15,
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female',
): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  return Math.round(bmr * (activityMultipliers[activityLevel] ?? 1.2))
}

export function calculateCalorieGoals(profile: UserProfile): CalorieGoals {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.sex)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  const targetCalories = Math.round(tdee * (goalAdjustments[profile.goal] ?? 1))

  const proteinGrams = Math.round((targetCalories * 0.3) / 4)
  const fatGrams = Math.round((targetCalories * 0.25) / 9)
  const carbGrams = Math.round((targetCalories * 0.45) / 4)

  const weightDiffKg = Math.abs(profile.weight - profile.desiredWeight)
  const timeToGoalMonths = weightDiffKg > 0 ? Math.ceil(weightDiffKg / 3) : 0

  return { bmr, tdee, targetCalories, proteinGrams, fatGrams, carbGrams, timeToGoalMonths }
}
