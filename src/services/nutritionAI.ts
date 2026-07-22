import type { NutritionAnalysis, NutritionAIResponse } from '@/types/nutrition'

export class NutritionAIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NutritionAIError'
  }
}

export async function analyzeMeal(mealDescription: string): Promise<NutritionAnalysis> {
  const trimmed = mealDescription.trim()

  if (!trimmed) {
    throw new NutritionAIError('Describe tu plato para analizarlo')
  }

  if (trimmed.length < 3) {
    throw new NutritionAIError('La descripción es muy corta')
  }

  const response = await fetch('/api/analyze-meal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealDescription: trimmed }),
  })

  let result: NutritionAIResponse
  try {
    result = await response.json()
  } catch (err) {
    throw new NutritionAIError(`Error del servidor (${response.status}). Intenta de nuevo.`)
  }

  if (!result.success || !result.data) {
    throw new NutritionAIError(result.error || 'No se pudo analizar la comida')
  }

  return result.data
}
