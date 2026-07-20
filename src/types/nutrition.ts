export interface MacroValue {
  grams: number
  calories: number
  percentage: number
}

export interface Ingredient {
  name: string
  quantity: string
  calories: number
}

export interface NutritionScore {
  value: number
  reason: string
}

export type AllergenType =
  | 'gluten'
  | 'milk'
  | 'eggs'
  | 'peanuts'
  | 'tree_nuts'
  | 'soy'
  | 'fish'
  | 'shellfish'
  | 'sesame'
  | 'mustard'
  | 'celery'
  | 'lupin'

export interface NutritionAnalysis {
  mealName: string
  estimatedCalories: number
  macros: {
    protein: MacroValue
    carbohydrates: MacroValue
    fat: MacroValue
  }
  ingredients: Ingredient[]
  nutritionScore: NutritionScore
  healthTips: string[]
  allergens?: AllergenType[]
  isVegan?: boolean
  isVegetarian?: boolean
}

export interface NutritionAIResponse {
  success: boolean
  data?: NutritionAnalysis
  error?: string
  provider?: string
}
