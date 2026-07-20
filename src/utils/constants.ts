import type { MealType } from '@/types/user'
import type { DietaryPreference, Allergen } from '@/types/recipe'

export interface SelectOption<T = string> {
  value: T
  label: string
  icon: string | [string, string]
}

export interface GoalOption {
  value: 'lose' | 'maintain' | 'gain'
  label: string
  desc: string
  icon: string | [string, string]
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Desayuno',
  lunch: 'Comida',
  dinner: 'Cena',
  snack: 'Snack',
}

export const MEAL_TYPE_ICONS: Record<MealType, [string, string]> = {
  breakfast: ['fas', 'sun'],
  lunch: ['fas', 'cloud-sun'],
  dinner: ['fas', 'moon'],
  snack: ['fas', 'cookie'],
}

export const MEAL_TYPE_OPTIONS: SelectOption<MealType>[] = [
  { value: 'breakfast', label: 'Desayuno', icon: ['fas', 'sun'] },
  { value: 'lunch', label: 'Comida', icon: ['fas', 'cloud-sun'] },
  { value: 'dinner', label: 'Cena', icon: ['fas', 'moon'] },
  { value: 'snack', label: 'Snack', icon: ['fas', 'cookie'] },
]

export const ACTIVITY_OPTIONS: SelectOption[] = [
  { value: 'sedentary', label: 'Sedentario', icon: ['fas', 'couch'] },
  { value: 'light', label: 'Ligero', icon: ['fas', 'person-walking'] },
  { value: 'moderate', label: 'Moderado', icon: ['fas', 'person-running'] },
  { value: 'active', label: 'Activo', icon: ['fas', 'person-biking'] },
  { value: 'very_active', label: 'Muy activo', icon: ['fas', 'fire'] },
]

export const GOAL_OPTIONS: GoalOption[] = [
  { value: 'lose', label: 'Perder peso', desc: 'Déficit calórico', icon: ['fas', 'arrow-down'] },
  { value: 'maintain', label: 'Mantener', desc: 'Balance calórico', icon: ['fas', 'equals'] },
  { value: 'gain', label: 'Ganar masa', desc: 'Superávit calórico', icon: ['fas', 'arrow-up'] },
]

export interface DietaryPreferenceOption {
  value: DietaryPreference
  label: string
  icon: [string, string]
}

export const DIETARY_PREFERENCE_OPTIONS: DietaryPreferenceOption[] = [
  { value: 'none', label: 'Sin preferencias específicas', icon: ['fas', 'utensils'] },
  { value: 'vegetarian', label: 'Vegetariana', icon: ['fas', 'leaf'] },
  { value: 'vegan', label: 'Vegana', icon: ['fas', 'seedling'] },
  { value: 'gluten_free', label: 'Sin gluten', icon: ['fas', 'wheat-awn-circle-exclamation'] },
]

export interface AllergenOption {
  value: Allergen
  label: string
  icon: [string, string]
}

export const ALLERGEN_OPTIONS: AllergenOption[] = [
  { value: 'gluten', label: 'Gluten', icon: ['fas', 'bread-slice'] },
  { value: 'milk', label: 'Leche', icon: ['fas', 'glass-water'] },
  { value: 'eggs', label: 'Huevo', icon: ['fas', 'egg'] },
  { value: 'peanuts', label: 'Cacahuetes', icon: ['fas', 'cookie'] },
  { value: 'tree_nuts', label: 'Frutos secos', icon: ['fas', 'bowl-food'] },
  { value: 'soy', label: 'Soja', icon: ['fas', 'leaf'] },
  { value: 'fish', label: 'Pescado', icon: ['fas', 'fish'] },
  { value: 'shellfish', label: 'Marisco', icon: ['fas', 'shrimp'] },
  { value: 'sesame', label: 'Sésamo', icon: ['fas', 'droplet'] },
  { value: 'mustard', label: 'Mostaza', icon: ['fas', 'droplet'] },
  { value: 'celery', label: 'Apio', icon: ['fas', 'carrot'] },
  { value: 'lupin', label: 'Altramuces', icon: ['fas', 'seedling'] },
]
