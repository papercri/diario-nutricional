import type { MealType } from './user'

export type { MealType }

export interface FoodItem {
  id: string
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize?: string
  barcode?: string
  imageUrl?: string
}

export interface MealEntry {
  id: string
  food: FoodItem
  servings: number
  mealType: MealType
  date: string
  timestamp: number
}

export interface NutritionSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface OpenFoodFactsProduct {
  code: string
  product: {
    product_name?: string
    brands?: string
    nutriments?: {
      'energy-kcal_100g'?: number
      proteins_100g?: number
      carbohydrates_100g?: number
      fat_100g?: number
    }
    image_url?: string
    serving_size?: string
  }
  status: number
}

export interface OpenFoodFactsSearchResult {
  count: number
  page: number
  page_size: number
  products: Array<{
    code: string
    product_name?: string
    brands?: string
    nutriments?: {
      'energy-kcal_100g'?: number
      proteins_100g?: number
      carbohydrates_100g?: number
      fat_100g?: number
    }
    image_url?: string
    serving_size?: string
  }>
}
