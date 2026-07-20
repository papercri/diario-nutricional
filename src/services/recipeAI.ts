import type { GeneratedRecipe, RecipeAIResponse, RecipeConfig } from '@/types/recipe'
import type { CalorieGoals } from '@/types/user'
import type { GoalType } from '@/types/user'

export class RecipeAIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RecipeAIError'
  }
}

export interface RecipeRequestConfig extends RecipeConfig {
  goal?: GoalType
  goals?: CalorieGoals
}

export async function generateRecipe(config: RecipeRequestConfig): Promise<GeneratedRecipe> {
  const goalLabels: Record<GoalType, string> = {
    lose: 'Perder peso',
    maintain: 'Mantener peso',
    gain: 'Ganar masa muscular',
  }

  const response = await fetch('/api/generate-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dietaryPreferences: config.dietaryPreferences,
      allergens: config.allergens,
      preferredIngredients: config.preferredIngredients,
      additionalInstructions: config.additionalInstructions,
      goal: config.goal ? goalLabels[config.goal] : undefined,
      targetCalories: config.goals?.targetCalories,
      proteinGrams: config.goals?.proteinGrams,
      carbGrams: config.goals?.carbGrams,
      fatGrams: config.goals?.fatGrams,
    }),
  })

  let result: RecipeAIResponse
  try {
    result = await response.json()
  } catch {
    throw new RecipeAIError(`Error del servidor (${response.status}). Intenta de nuevo.`)
  }

  if (!result.success || !result.data) {
    throw new RecipeAIError(result.error || 'No se pudo generar la receta')
  }

  return result.data
}
