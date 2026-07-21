import type { VercelRequest, VercelResponse } from '@vercel/node'
import { callGroq } from './providers/groq.js'
import { callCerebras } from './providers/cerebras.js'

function buildSystemPrompt(userContext: string): string {
  return `Eres un chef profesional experto en nutrición. Genera recetas personalizadas basadas en las preferencias del usuario.

${userContext}

Responde ÚNICAMENTE con este JSON, sin texto adicional ni backticks:
{
  "recipeName": "string - nombre atractivo de la receta",
  "description": "string - breve descripción del plato (1-2 frases)",
  "servings": number - porciones que rinde la receta,
  "preparationTime": "string - tiempo de preparación estimado (ej: 15 minutos)",
  "cookingTime": "string - tiempo de cocción estimado (ej: 25 minutos)",
  "ingredients": [
    { "name": "string - ingrediente", "quantity": "string - cantidad exacta (ej: 200g, 2 cucharadas, 1 unidad)" }
  ],
  "steps": [
    "string - paso detallado de preparación"
  ],
  "estimatedCalories": number - calorías totales de la receta para una porción,
  "macros": {
    "protein": number - gramos de proteína para una porción,
    "carbohydrates": number - gramos de carbohidratos para una porción,
    "fat": number - gramos de grasa para una porción
  },
  "tips": ["string - consejo útil sobre la receta, almacenamiento o variaciones"]
}

Reglas:
- Siempre genera recetas realistas y equilibradas nutricionalmente.
- Las calorias y macronutrientes deben ser calcoladas por cada ración, no por la receta completa.
- Adapta las calorías y macronutrientes al objetivo calórico del usuario si se proporciona.
- Respeta estrictamente todas las restricciones dietéticas, preferencias y alérgenos indicados.
- Incluye al menos 5 ingredientes y 4 pasos de preparación.
- Usa cantidades métricas (gramos, mililitros).
- Proporciona consejos prácticos y variaciones.
- Nunca incluyas ingredientes que el usuario haya excluido por alergias.
- Responde siempre en español de España.
- No incluyas ningún texto fuera del JSON.`
}

function buildUserMessage(config: {
  dietaryPreferences: string[]
  allergens: string[]
  preferredIngredients: string
  additionalInstructions: string
  goal?: string
  targetCalories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
}): string {
  const parts: string[] = []

  if (config.goal) {
    parts.push(`Objetivo nutricional: ${config.goal}`)
  }
  if (config.targetCalories) {
    parts.push(`Calorías objetivo diarias: ${config.targetCalories} kcal`)
  }
  if (config.proteinGrams) {
    parts.push(`Proteínas objetivo: ${config.proteinGrams}g/día`)
  }
  if (config.carbGrams) {
    parts.push(`Carbohidratos objetivo: ${config.carbGrams}g/día`)
  }
  if (config.fatGrams) {
    parts.push(`Grasas objetivo: ${config.fatGrams}g/día`)
  }

  if (config.dietaryPreferences.length > 0 && !config.dietaryPreferences.includes('none')) {
    parts.push(`Preferencias dietéticas: ${config.dietaryPreferences.join(', ')}`)
  }

  if (config.allergens.length > 0) {
    parts.push(`ALÉRGENOS A EXCLUIR (nunca incluir estos ingredientes ni sus derivados): ${config.allergens.join(', ')}`)
  }

  if (config.preferredIngredients.trim()) {
    parts.push(`Ingredientes preferidos: ${config.preferredIngredients.trim()}`)
  }

  if (config.additionalInstructions.trim()) {
    parts.push(`Instrucciones adicionales: ${config.additionalInstructions.trim()}`)
  }

  return parts.join('\n')
}

function stripMarkdownCodeBlocks(text: string): string {
  const trimmed = text.trim()

  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    return jsonMatch[1].trim()
  }

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return trimmed
}

function validateRecipe(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  if (typeof obj.recipeName !== 'string') return false
  if (typeof obj.description !== 'string') return false
  if (typeof obj.servings !== 'number') return false
  if (typeof obj.preparationTime !== 'string') return false
  if (typeof obj.cookingTime !== 'string') return false
  if (!Array.isArray(obj.ingredients) || obj.ingredients.length < 3) return false
  if (!Array.isArray(obj.steps) || obj.steps.length < 3) return false
  if (typeof obj.estimatedCalories !== 'number') return false
  if (typeof obj.macros !== 'object' || obj.macros === null) return false

  const macros = obj.macros as Record<string, unknown>
  if (typeof macros.protein !== 'number') return false
  if (typeof macros.carbohydrates !== 'number') return false
  if (typeof macros.fat !== 'number') return false

  if (!Array.isArray(obj.tips)) return false

  return true
}

type ProviderResult = { content: string; provider: string }

type RecipeOutcome =
  | { kind: 'success'; data: unknown; provider: string }
  | { kind: 'error'; message: string }

function parseProviderResponse(result: ProviderResult): RecipeOutcome {
  const raw = stripMarkdownCodeBlocks(result.content)

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error(`No se pudo parsear JSON de ${result.provider}. Contenido crudo:`, result.content)
    throw new Error('Respuesta del AI no es JSON válido')
  }

  if (!validateRecipe(parsed)) {
    console.error(`Respuesta de ${result.provider} no cumple el schema:`, parsed)
    throw new Error('Respuesta del AI no cumple con el schema requerido')
  }

  return { kind: 'success', data: parsed, provider: result.provider }
}

function respondWithOutcome(res: VercelResponse, outcome: RecipeOutcome) {
  if (outcome.kind === 'error') {
    return res.status(400).json({
      success: false,
      error: outcome.message,
    })
  }

  return res.status(200).json({
    success: true,
    data: outcome.data,
    provider: outcome.provider,
  })
}

interface RecipeRequestBody {
  dietaryPreferences?: string[]
  allergens?: string[]
  preferredIngredients?: string
  additionalInstructions?: string
  goal?: string
  targetCalories?: number
  proteinGrams?: number
  carbGrams?: number
  fatGrams?: number
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Método no permitido' })
    }

    const body = (req.body ?? {}) as RecipeRequestBody

    const userMessage = buildUserMessage({
      dietaryPreferences: body.dietaryPreferences ?? [],
      allergens: body.allergens ?? [],
      preferredIngredients: body.preferredIngredients ?? '',
      additionalInstructions: body.additionalInstructions ?? '',
      goal: body.goal,
      targetCalories: body.targetCalories,
      proteinGrams: body.proteinGrams,
      carbGrams: body.carbGrams,
      fatGrams: body.fatGrams,
    })

    if (!userMessage.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Configura al menos una preferencia o instrucción para generar la receta',
      })
    }

    const systemPrompt = buildSystemPrompt('')

    try {
      const outcome = parseProviderResponse(await callGroq(userMessage, systemPrompt))
      return respondWithOutcome(res, outcome)
    } catch (groqError) {
      console.error('Groq falló, intentando Cerebras:', groqError)

      try {
        const outcome = parseProviderResponse(await callCerebras(userMessage, systemPrompt))
        return respondWithOutcome(res, outcome)
      } catch (cerebrasError) {
        console.error('Cerebras también falló:', cerebrasError)

        return res.status(502).json({
          success: false,
          error: 'No se pudo generar la receta en este momento. Intenta de nuevo.',
        })
      }
    }
  } catch (fatalError) {
    console.error('Fallo inesperado en generate-recipe:', fatalError)
    return res.status(500).json({
      success: false,
      error: 'Error inesperado en el servidor.',
    })
  }
}
