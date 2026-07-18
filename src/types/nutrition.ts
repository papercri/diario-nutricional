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
}

export interface NutritionAIResponse {
  success: boolean
  data?: NutritionAnalysis
  error?: string
  provider?: string
}
