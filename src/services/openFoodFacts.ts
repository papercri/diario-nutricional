import type {
  FoodItem,
  NutriScoreGrade,
  OpenFoodFactsSearchResult,
  OpenFoodFactsProduct,
} from '../types/food'

const BASE_URL = 'https://world.openfoodfacts.org'
const DEFAULT_TIMEOUT_MS = 8000

// OFF pide un User-Agent identificable. Sin esto, algunas requests
// se degradan o se limitan silenciosamente.
const USER_AGENT = 'Avocato/1.0'

const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'brands',
  'nutriments',
  'image_url',
  'serving_size',
  'nutriscore_grade',
].join(',')

class OpenFoodFactsError extends Error {
  readonly cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'OpenFoodFactsError'
    this.cause = cause
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  // si el caller pasa su propio signal (para cancelar búsquedas en vivo),
  // lo encadenamos con el timeout
  signal?.addEventListener('abort', () => controller.abort())

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    })

    if (!response.ok) {
      throw new OpenFoodFactsError(`Open Food Facts respondió ${response.status}`)
    }

    return (await response.json()) as T
  } catch (err) {
    if (err instanceof OpenFoodFactsError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new OpenFoodFactsError('La búsqueda tardó demasiado, intentá de nuevo')
    }
    throw new OpenFoodFactsError('No se pudo conectar con Open Food Facts', err)
  } finally {
    clearTimeout(timeout)
  }
}

const VALID_NUTRI_SCORES = new Set<string>(['a', 'b', 'c', 'd', 'e'])

function toFoodItem(
  code: string,
  p: OpenFoodFactsProduct['product'] | OpenFoodFactsSearchResult['products'][number],
): FoodItem {
  const raw = p?.nutriscore_grade
  const nutriScore = raw && VALID_NUTRI_SCORES.has(raw) ? (raw as NutriScoreGrade) : undefined

  return {
    id: code,
    name: p?.product_name ?? 'Sin nombre',
    brand: p?.brands,
    calories: p?.nutriments?.['energy-kcal_100g'] ?? 0,
    protein: p?.nutriments?.proteins_100g ?? 0,
    carbs: p?.nutriments?.carbohydrates_100g ?? 0,
    fat: p?.nutriments?.fat_100g ?? 0,
    barcode: code,
    imageUrl: p?.image_url,
    servingSize: p?.serving_size,
    nutriScore,
  }
}

export async function searchFood(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<FoodItem[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const params = new URLSearchParams({
    search_terms: trimmed,
    json: '1',
    page: String(page),
    page_size: '20',
    fields: PRODUCT_FIELDS,
  })

  const data = await fetchJson<OpenFoodFactsSearchResult>(
    `${BASE_URL}/cgi/search.pl?${params}`,
    signal,
  )

  if (!Array.isArray(data.products)) return []

  return data.products
    .filter(p => p.product_name && p.nutriscore_grade)
    .map(p => toFoodItem(p.code, p))
    .filter(item => item.calories > 0)
}

export async function getProductByBarcode(
  barcode: string,
  signal?: AbortSignal,
): Promise<FoodItem | null> {
  const params = new URLSearchParams({ fields: PRODUCT_FIELDS })

  const data = await fetchJson<OpenFoodFactsProduct>(
    `${BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json?${params}`,
    signal,
  )

  if (data.status !== 1 || !data.product) return null

  return toFoodItem(data.code, data.product)
}

export { OpenFoodFactsError }
