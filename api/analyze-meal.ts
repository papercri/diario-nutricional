import type { VercelRequest, VercelResponse } from '@vercel/node'
import { callGroq } from './providers/groq.js'
import { callCerebras } from './providers/cerebras.js'

const SYSTEM_PROMPT = `Eres un asistente que solo habla de comida.

Analiza el mensaje del usuario, en cualquier idioma.

Si el mensaje NO menciona un plato, ingrediente o alimento reconocible, responde ÚNICAMENTE con este JSON, sin texto adicional ni backticks:
{
  "error": "not_food"
}

Si el mensaje SÍ es un plato, ingrediente o alimento, responde ÚNICAMENTE con este JSON, sin texto adicional ni backticks:
{
  "mealName": "string - nombre del plato",
  "estimatedCalories": number,
  "macros": {
    "protein": { "grams": number, "calories": number, "percentage": number },
    "carbohydrates": { "grams": number, "calories": number, "percentage": number },
    "fat": { "grams": number, "calories": number, "percentage": number }
  },
  "ingredients": [
    { "name": "string", "quantity": "string - ej: 150g", "calories": number }
  ],
  "nutritionScore": { "value": number - de 1 a 100, "reason": "string" },
  "healthTips": ["string - consejo práctico"]
}

Reglas:
- Estima porciones realistas cuando no se especifiquen (ej: pasta, arroz o derivados 70gr en crudo).
- Calcula calorías y macronutrientes.
- Explica los ingredientes con cantidades estimadas.
- Proporciona consejos de bienestar prácticos.
- Nunca proporciones diagnósticos médicos.
- Responde siempre en español.
- No incluyas ningún texto fuera del JSON.`

function stripMarkdownCodeBlocks(text: string): string {
  const trimmed = text.trim()

  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    return jsonMatch[1].trim()
  }

  // El modelo a veces añade texto antes o después del JSON sin usar backticks.
  // En ese caso, nos quedamos solo con el bloque entre la primera y la última llave.
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return trimmed
}

const NOT_FOOD_MESSAGE = 'Por favor introduce el nombre de un plato o de una comida'

function isNotFoodError(data: unknown): data is { error: string } {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return obj.error === 'not_food'
}

function validateAnalysis(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  if (typeof obj.mealName !== 'string') return false
  if (typeof obj.estimatedCalories !== 'number') return false
  if (typeof obj.macros !== 'object' || obj.macros === null) return false

  const macros = obj.macros as Record<string, unknown>
  for (const key of ['protein', 'carbohydrates', 'fat']) {
    const macro = macros[key] as Record<string, unknown> | undefined
    if (!macro) return false
    if (typeof macro.grams !== 'number') return false
    if (typeof macro.calories !== 'number') return false
    if (typeof macro.percentage !== 'number') return false
  }

  if (!Array.isArray(obj.ingredients)) return false
  if (typeof obj.nutritionScore !== 'object' || obj.nutritionScore === null) return false
  if (!Array.isArray(obj.healthTips)) return false

  return true
}

type ProviderResult = { content: string; provider: string }

type AnalysisOutcome =
  | { kind: 'success'; data: unknown; provider: string }
  | { kind: 'not_food'; message: string }

function parseProviderResponse(result: ProviderResult): AnalysisOutcome {
  const raw = stripMarkdownCodeBlocks(result.content)

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    console.error(`No se pudo parsear JSON de ${result.provider}. Contenido crudo:`, result.content)
    throw new Error('Respuesta del AI no es JSON válido')
  }

  if (isNotFoodError(parsed)) {
    return { kind: 'not_food', message: NOT_FOOD_MESSAGE }
  }

  if (!validateAnalysis(parsed)) {
    console.error(`Respuesta de ${result.provider} no cumple el schema:`, parsed)
    throw new Error('Respuesta del AI no cumple con el schema requerido')
  }

  return { kind: 'success', data: parsed, provider: result.provider }
}

function respondWithOutcome(res: VercelResponse, outcome: AnalysisOutcome) {
  if (outcome.kind === 'not_food') {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Método no permitido' })
    }

    const { mealDescription } = (req.body ?? {}) as { mealDescription?: unknown }

    if (!mealDescription || typeof mealDescription !== 'string' || mealDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere una descripción de la comida',
      })
    }

    const description = mealDescription.trim()

    try {
      const outcome = parseProviderResponse(await callGroq(description, SYSTEM_PROMPT))
      return respondWithOutcome(res, outcome)
    } catch (groqError) {
      console.error('Groq falló, intentando Cerebras:', groqError)

      try {
        const outcome = parseProviderResponse(await callCerebras(description, SYSTEM_PROMPT))
        return respondWithOutcome(res, outcome)
      } catch (cerebrasError) {
        console.error('Cerebras también falló:', cerebrasError)

        return res.status(502).json({
          success: false,
          error: 'No se pudo analizar la comida en este momento. Intenta de nuevo.',
        })
      }
    }
  } catch (fatalError) {
    console.error('Fallo inesperado en analyze-meal, antes de llegar a los providers:', fatalError)
    return res.status(500).json({
      success: false,
      error: 'Error inesperado en el servidor.',
    })
  }
}
