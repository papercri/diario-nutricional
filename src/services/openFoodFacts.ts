import type { FoodItem, OpenFoodFactsSearchResult, OpenFoodFactsProduct } from '../types/food'

const BASE_URL = 'https://world.openfoodfacts.org'

export async function searchFood(query: string, page = 1): Promise<FoodItem[]> {
  const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page=${page}&page_size=20`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error al buscar alimentos: ${response.statusText}`)
  }

  const data: OpenFoodFactsSearchResult = await response.json()

  return data.products
    .filter(p => p.product_name)
    .map(p => ({
      id: p.code,
      name: p.product_name ?? 'Sin nombre',
      brand: p.brands,
      calories: p.nutriments?.['energy-kcal_100g'] ?? 0,
      protein: p.nutriments?.proteins_100g ?? 0,
      carbs: p.nutriments?.carbohydrates_100g ?? 0,
      fat: p.nutriments?.fat_100g ?? 0,
      barcode: p.code,
      imageUrl: p.image_url,
      servingSize: p.serving_size,
    }))
}

export async function getProductByBarcode(barcode: string): Promise<FoodItem | null> {
  const url = `${BASE_URL}/api/v2/product/${barcode}.json`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error al obtener producto: ${response.statusText}`)
  }

  const data: OpenFoodFactsProduct = await response.json()
  if (data.status !== 1 || !data.product) return null

  return {
    id: data.code,
    name: data.product.product_name ?? 'Sin nombre',
    brand: data.product.brands,
    calories: data.product.nutriments?.['energy-kcal_100g'] ?? 0,
    protein: data.product.nutriments?.proteins_100g ?? 0,
    carbs: data.product.nutriments?.carbohydrates_100g ?? 0,
    fat: data.product.nutriments?.fat_100g ?? 0,
    barcode: data.code,
    imageUrl: data.product.image_url,
    servingSize: data.product.serving_size,
  }
}
