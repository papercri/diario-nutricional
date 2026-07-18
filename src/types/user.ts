export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type GoalType = 'lose' | 'maintain' | 'gain'
export type Sex = 'male' | 'female'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  desiredWeight: number
  sex: Sex
  activityLevel: ActivityLevel
  goal: GoalType
}

export interface CalorieGoals {
  bmr: number
  tdee: number
  targetCalories: number
  proteinGrams: number
  fatGrams: number
  carbGrams: number
  timeToGoalMonths: number
}
