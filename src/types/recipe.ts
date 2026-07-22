export type Allergen =
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

export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'gluten_free'

export interface RecipeConfig {
  dietaryPreferences: DietaryPreference[]
  allergens: Allergen[]
  preferredIngredients: string
  additionalInstructions: string
}

export interface RecipeIngredient {
  name: string
  quantity: string
}

export interface RecipeMacros {
  protein: number
  carbohydrates: number
  fat: number
}

export interface GeneratedRecipe {
  recipeName: string
  description: string
  servings: number
  preparationTime: string
  cookingTime: string
  ingredients: RecipeIngredient[]
  steps: string[]
  estimatedCalories: number
  macros: RecipeMacros
  tips: string[]
}

export interface RecipeAIResponse {
  success: boolean
  data?: GeneratedRecipe
  error?: string
  provider?: string
}
