import type { VercelRequest, VercelResponse } from '@vercel/node'
import { callGroq } from './providers/groq.js'
import { callCerebras } from './providers/cerebras.js'

const SYSTEM_PROMPT = `Eres un asistente de nutrición.

Analiza la descripción de la comida del usuario.

Devuelve ÚNICAMENTE JSON válido.

Reglas:
- Estima porciones realistas cuando no se especifiquen.
- Calcula calorías y macronutrientes.
- Explica los ingredientes con cantidades estimadas.
- Proporciona consejos de bienestar prácticos.
- Nunca proporciones diagnósticos médicos.
- Siempre responde en español.
- Incluye un nivel de confianza (low, medium, high).

Schema JSON requerido:
{
  "mealName": "string - nombre del plato",
  "estimatedCalories": number - calorías totales estimadas,
  "macros": {
    "protein": { "grams": number, "calories": number, "percentage": number },
    "carbohydrates": { "grams": number, "calories": number, "percentage": number },
    "fat": { "grams": number, "calories": number, "percentage": number }
  },
  "ingredients": [
    { "name": "string", "quantity": "string - ej: 150g", "calories": number }
  ],
  "nutritionScore": { "value": number - de 1 a 100, "reason": "string" },
  "healthTips": ["string - consejo práctico"],
  "confidence": "low" | "medium" | "high"
}`

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
  if (!['low', 'medium', 'high'].includes(obj.confidence as string)) return false

  return true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' })
  }

  const { mealDescription } = req.body

  if (!mealDescription || typeof mealDescription !== 'string' || mealDescription.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Se requiere una descripción de la comida',
    })
  }

  try {
    const result = await callGroq(mealDescription.trim(), SYSTEM_PROMPT)
    const parsed = JSON.parse(result.content)

    if (!validateAnalysis(parsed)) {
      throw new Error('Respuesta del AI no cumple con el schema requerido')
    }

    return res.status(200).json({
      success: true,
      data: parsed,
      provider: result.provider,
    })
  } catch (groqError) {
    console.error('Groq falló, intentando Cerebras:', groqError)

    try {
      const result = await callCerebras(mealDescription.trim(), SYSTEM_PROMPT)
      const parsed = JSON.parse(result.content)

      if (!validateAnalysis(parsed)) {
        throw new Error('Respuesta del AI no cumple con el schema requerido')
      }

      return res.status(200).json({
        success: true,
        data: parsed,
        provider: result.provider,
      })
    } catch (cerebrasError) {
      console.error('Cerebras también falló:', cerebrasError)

      return res.status(502).json({
        success: false,
        error: 'No se pudo analizar la comida en este momento. Intenta de nuevo.',
      })
    }
  }
}
