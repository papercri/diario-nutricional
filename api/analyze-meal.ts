import type { VercelRequest, VercelResponse } from '@vercel/node'
import { callGroq } from './providers/groq.js'
import { callCerebras } from './providers/cerebras.js'

const SYSTEM_PROMPT = `Eres un asistente experto en nutrición y alérgenos alimentarios.

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
    "protein": {
      "grams": number,
      "calories": number,
      "percentage": number
    },
    "carbohydrates": {
      "grams": number,
      "calories": number,
      "percentage": number
    },
    "fat": {
      "grams": number,
      "calories": number,
      "percentage": number
    }
  },
  "ingredients": [
    {
      "name": "string",
      "quantity": "string - cantidad utilizada para UNA RACIÓN, ej: 150g",
      "calories": number
    }
  ],
  "nutritionScore": {
    "value": number - de 1 a 100,
    "reason": "string"
  },
  "healthTips": ["string - consejo práctico"],
  "allergens": ["string - lista de alérgenos presentes"],
  "isVegan": boolean,
  "isVegetarian": boolean
}

REGLA PRIORITARIA: UNA ÚNICA RACIÓN

Todos los valores nutricionales deben referirse SIEMPRE a una única ración individual del plato.

Esto incluye:

- estimatedCalories
- macros.protein.grams
- macros.protein.calories
- macros.protein.percentage
- macros.carbohydrates.grams
- macros.carbohydrates.calories
- macros.carbohydrates.percentage
- macros.fat.grams
- macros.fat.calories
- macros.fat.percentage
- las calorías de cada ingrediente

REGLAS DE PORCIONES Y CÁLCULO NUTRICIONAL:

- Si el usuario indica explícitamente el número de raciones, divide las cantidades, calorías y macronutrientes totales entre ese número de raciones.
- Si el usuario indica cantidades para varias raciones, calcula primero el total y después divide todos los valores entre el número de raciones.
- Si el usuario dice, por ejemplo, "para 4 personas", "4 raciones" o "4 servings", los valores nutricionales deben corresponder a UNA de esas 4 raciones, no a la receta completa.
- Si el usuario no especifica el número de raciones, estima una única ración individual realista.
- Las cantidades de los ingredientes deben representar la cantidad consumida en esa única ración.
- Las calorías de cada ingrediente deben corresponder únicamente a la cantidad indicada en `quantity`.
- `estimatedCalories` debe representar el total aproximado de las calorías de todos los ingredientes de esa única ración.
- Los macronutrientes deben corresponder exactamente a esa misma única ración.
- No devuelvas valores nutricionales de la receta completa cuando la receta contiene varias raciones.
- La suma de las calorías de proteínas, carbohidratos y grasas debe ser razonablemente consistente con `estimatedCalories`.
- Usa aproximadamente:
  - proteína: 4 kcal por gramo
  - carbohidratos: 4 kcal por gramo
  - grasa: 9 kcal por gramo
- Las pequeñas diferencias por redondeo son aceptables.
- Los porcentajes de macronutrientes deben representar la distribución calórica aproximada de esa única ración y sumar aproximadamente 100%.

REGLAS PARA ALÉRGENOS (MUY IMPORTANTE - SIEMPRE DEBES INCLUIR ESTE CAMPO):

- Analiza CADA ingrediente del plato y determina qué alérgenos contiene.
- Usa EXACTAMENTE estos valores en el array:
  "gluten",
  "milk",
  "eggs",
  "peanuts",
  "tree_nuts",
  "soy",
  "fish",
  "shellfish",
  "sesame",
  "mustard",
  "celery",
  "lupin".
- No añadas otros valores.
- No repitas valores en el array.

Ejemplos de alérgenos por ingrediente:

- Pan, pasta, harina, trigo, cebada, centeno → gluten
- Leche, queso, yogur, mantequilla, nata → milk
- Huevos, mayonesa → eggs
- Cacahuetes, mantequilla de cacahuete → peanuts
- Almendras, nueces, avellanas, pistachos → tree_nuts
- Tofu, salsa de soja, edamame → soy
- Salmón, atún, bacalao, sardinas → fish
- Camarones, langostinos, gambas, cangrejo, mejillones → shellfish
- Tahini, semillas de sésamo y productos que contengan sésamo → sesame
- Mostaza y salsa de mostaza → mustard
- Apio y productos que contengan apio → celery
- Altramuces y productos que contengan altramuz → lupin

Reglas específicas:

- Si el plato contiene harina de trigo, pan o cualquier cereal que contenga gluten, incluye "gluten".
- Si el plato contiene cualquier tipo de lácteo, incluye "milk".
- Si el plato contiene huevo o derivados del huevo, incluye "eggs".
- El hummus solo implica "sesame" si contiene tahini o sésamo.
- Si no contiene ninguno de estos alérgenos conocidos, devuelve [].

REGLAS PARA ISVEGAN / ISVEGETARIAN:

- isVegan: true solo si NO contiene carne, pescado, marisco, huevos, lácteos, miel ni ningún otro producto de origen animal.
- isVegetarian: true si NO contiene carne, pescado ni marisco. Puede contener huevos, lácteos o miel.
- Si isVegan es true, isVegetarian también debe ser true.

REGLAS GENERALES:

- Estima porciones realistas cuando no se especifiquen.
- Calcula calorías y macronutrientes exclusivamente para una única ración.
- Explica los ingredientes con cantidades estimadas para esa única ración.
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

// ── Inferencia de alérgenos y dieta desde ingredientes ──

type AllergenType =
  | 'gluten' | 'milk' | 'eggs' | 'peanuts' | 'tree_nuts'
  | 'soy' | 'fish' | 'shellfish' | 'sesame' | 'mustard'
  | 'celery' | 'lupin'

const ALLERGEN_KEYWORDS: Record<AllergenType, string[]> = {
  gluten: [
    'pan', 'pasta', 'harina', 'trigo', 'cebada', 'centeno', 'avena', 'galleta',
    'tortilla', 'pizza', 'empanada', 'croissant', 'baguette', 'cereal', 'avena',
    'sémola', 'bulgur', 'cuscús', 'macarrones', 'espagueti', 'fideos', 'masa',
    'bizcocho', 'magdalena', 'pancakes', 'waffle', 'bollo', 'sandwich', 'tostada',
  ],
  milk: [
    'leche', 'queso', 'yogur', 'mantequilla', 'nata', 'crema', 'helado',
    'chocolate', 'requesón', 'ricotta', 'mozzarella', 'parmesano', 'cheddar',
    'bechamel', 'salsa blanca', 'suero', 'buttermilk', 'kefir',
  ],
  eggs: [
    'huevo', 'huevos', 'mayonesa', 'merengue', 'batido', 'tortilla francesa',
    'omelette', 'flan', 'bizcocho', 'magdalena', 'pasta fresca', 'carbonara',
  ],
  peanuts: ['cacahuete', 'cacahuate', 'mantequilla de cacahuete', 'gofio'],
  tree_nuts: [
    'almendra', 'almendras', 'nuez', 'nueces', 'avellana', 'avellanas',
    'pistacho', 'pistachos', 'cashew', 'anacardo', 'nuez de Brasil',
    'macadamia', 'piñones', 'curracha',
  ],
  soy: ['tofu', 'soja', 'edamame', 'salsa de soja', 'tempeh', 'miso', 'leche de soja'],
  fish: [
    'salmón', 'atún', 'bacalao', 'sardinas', 'anchoa', 'anchoas', 'trucha',
    'merluza', 'dorada', 'lubina', 'pez espada', 'jurel', 'pescado',
  ],
  shellfish: [
    'camarón', 'camarones', 'langostino', 'langostinos', 'calamar', 'calamares',
    'mejillón', 'mejillones', 'ostra', 'ostras', 'almeja', 'almejas',
    'cangrejo', 'cigala', 'percebe', 'berberecho',
  ],
  sesame: ['sésamo', 'sesamo', 'tahini', 'hummus', 'pan de semillas'],
  mustard: ['mostaza', 'salsa de mostaza'],
  celery: ['apio', 'salsa de apio', 'celery'],
  lupin: ['altramuz', 'altramuces', 'lupini'],
}

const MEAT_KEYWORDS = [
  'pollo', 'carne', 'ternera', 'cerdo', 'cordero', 'vacuno', 'buey',
  'jamón', 'jamón', 'tocino', 'bacon', 'chorizo', 'salchicha', 'pavo',
  'pato', 'conejo', 'venado', 'cabrito', 'costillas', 'entrecot',
  'chuletón', 'hamburguesa', 'meatball', 'albóndiga', 'bistec', 'filete',
]

const FISH_KEYWORDS = [
  'salmón', 'atún', 'bacalao', 'sardinas', 'anchoa', 'trucha',
  'merluza', 'pescado', 'marisco', 'camarón', 'langostino', 'calamar',
  'mejillón', 'ostra', 'cangrejo',
]

const ANIMAL_PRODUCTS = [
  'huevo', 'huevos', 'leche', 'queso', 'yogur', 'mantequilla', 'nata',
  'miel', 'gelatina',
]

function detectAllergens(ingredientNames: string[]): AllergenType[] {
  const found = new Set<AllergenType>()
  const lower = ingredientNames.map(n => n.toLowerCase())

  for (const [allergen, keywords] of Object.entries(ALLERGEN_KEYWORDS) as [AllergenType, string[]][]) {
    for (const ingredient of lower) {
      for (const kw of keywords) {
        if (ingredient.includes(kw)) {
          found.add(allergen)
          break
        }
      }
      if (found.has(allergen)) break
    }
  }

  return Array.from(found)
}

function inferDietaryFlags(ingredientNames: string[]): { isVegan: boolean; isVegetarian: boolean } {
  const lower = ingredientNames.map(n => n.toLowerCase())
  const fullText = lower.join(' ')

  const hasMeat = MEAT_KEYWORDS.some(kw => fullText.includes(kw))
  const hasFish = FISH_KEYWORDS.some(kw => fullText.includes(kw))
  const hasAnimal = ANIMAL_PRODUCTS.some(kw => fullText.includes(kw))

  const isVegetarian = !hasMeat && !hasFish
  const isVegan = isVegetarian && !hasAnimal

  return { isVegan, isVegetarian }
}

function enrichAnalysis(data: Record<string, unknown>): Record<string, unknown> {
  const ingredients = data.ingredients as Array<{ name: string }> | undefined
  if (!ingredients || !Array.isArray(ingredients)) return data

  const names = ingredients.map(i => i.name)

  if (!Array.isArray(data.allergens) || data.allergens.length === 0) {
    data.allergens = detectAllergens(names)
  }

  if (typeof data.isVegan !== 'boolean' || typeof data.isVegetarian !== 'boolean') {
    const flags = inferDietaryFlags(names)
    if (typeof data.isVegan !== 'boolean') data.isVegan = flags.isVegan
    if (typeof data.isVegetarian !== 'boolean') data.isVegetarian = flags.isVegetarian
  }

  return data
}

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

  // New fields: allergens, isVegan, isVegetarian (optional for backwards compatibility)
  if (obj.allergens !== undefined && !Array.isArray(obj.allergens)) return false
  if (obj.isVegan !== undefined && typeof obj.isVegan !== 'boolean') return false
  if (obj.isVegetarian !== undefined && typeof obj.isVegetarian !== 'boolean') return false

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

  const enriched = enrichAnalysis(parsed as Record<string, unknown>)

  return { kind: 'success', data: enriched, provider: result.provider }
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
