import type { MealType } from '@/types/user'

export interface SelectOption<T = string> {
  value: T
  label: string
  icon: string
}

export interface GoalOption {
  value: 'lose' | 'maintain' | 'gain'
  label: string
  desc: string
  icon: string
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Snack',
}

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: 'fa-solid fa-sun',
  lunch: 'fa-solid fa-cloud-sun',
  dinner: 'fa-solid fa-moon',
  snack: 'fa-solid fa-cookie',
}

export const MEAL_TYPE_OPTIONS: SelectOption<MealType>[] = [
  { value: 'breakfast', label: 'Desayuno', icon: 'fa-solid fa-sun' },
  { value: 'lunch', label: 'Comida', icon: 'fa-solid fa-cloud-sun' },
  { value: 'dinner', label: 'Cena', icon: 'fa-solid fa-moon' },
  { value: 'snack', label: 'Snack', icon: 'fa-solid fa-cookie' },
]

export const ACTIVITY_OPTIONS: SelectOption[] = [
  { value: 'sedentary', label: 'Sedentario', icon: 'fa-solid fa-couch' },
  { value: 'light', label: 'Ligero', icon: 'fa-solid fa-person-walking' },
  { value: 'moderate', label: 'Moderado', icon: 'fa-solid fa-person-running' },
  { value: 'active', label: 'Activo', icon: 'fa-solid fa-person-biking' },
  { value: 'very_active', label: 'Muy activo', icon: 'fa-solid fa-fire' },
]

export const GOAL_OPTIONS: GoalOption[] = [
  { value: 'lose', label: 'Perder peso', desc: 'Déficit calórico', icon: 'fa-solid fa-arrow-down' },
  { value: 'maintain', label: 'Mantener', desc: 'Balance calórico', icon: 'fa-solid fa-equals' },
  { value: 'gain', label: 'Ganar masa', desc: 'Superávit calórico', icon: 'fa-solid fa-arrow-up' },
]
